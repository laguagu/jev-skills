import unittest
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import check


def answer(label, confidence=0.95):
    return {"type": "choice", "choice": label, "confidence": confidence,
            "probabilities": {key: 1.0 if key == label else 0.0 for key in check.CRITERIA}}


class Decisions(unittest.TestCase):
    def test_custom_dataset_preserves_source_text(self):
        case = {"id": "custom", "claim": "Säilytysaika on 7 päivää.", "passages": ["  Loki poistetaan 7 päivän kuluttua.  "], "expected": "supported"}
        with TemporaryDirectory() as folder:
            path = Path(folder) / "cases.json"
            path.write_text(json.dumps([case]), encoding="utf-8")
            loaded, digest = check.load_cases(path)
        self.assertEqual(loaded, [case])
        self.assertEqual(check.request_body(loaded[0])["state"]["passages"], case["passages"])
        self.assertEqual(len(digest), 64)

    def test_bad_datasets_fail_before_api_calls(self):
        valid = {"id": "one", "claim": "X", "passages": [], "expected": "not_stated"}
        bad = [[], {}, [valid, valid], [{**valid, "passages": "text"}], [{**valid, "expected": "review"}], [{**valid, "claim": ""}]]
        with TemporaryDirectory() as folder:
            path = Path(folder) / "cases.json"
            for dataset in bad:
                with self.subTest(dataset=dataset):
                    path.write_text(json.dumps(dataset), encoding="utf-8")
                    with self.assertRaises(ValueError):
                        check.load_cases(path)

    def test_published_snapshot_replays_with_current_policy(self):
        report = json.loads((check.ROOT / "run.json").read_text(encoding="utf-8"))
        for expected in report["threshold_sweep"]:
            self.assertEqual(check.summarize(report["rows"], expected["threshold"]), expected)

    def test_absence_is_not_negative(self):
        self.assertEqual(check.compose({"p0": answer("irrelevant")}, .8), "not_stated")

    def test_conflicts_are_preserved(self):
        self.assertEqual(check.compose({"p0": answer("supports"), "p1": answer("contradicts")}, .8), "conflicting")

    def test_uncertainty_escalates(self):
        self.assertEqual(check.compose({"p0": answer("supports", .4)}, .8), "review")

    def test_labels_never_enter_request(self):
        body = check.request_body({"id": "private-label", "expected": "supported", "claim": "X", "passages": ["Y"]})
        self.assertNotIn("expected", str(body))
        self.assertNotIn("private-label", str(body))

    def test_incomplete_answer_fails(self):
        with self.assertRaises(ValueError):
            check.validate_answers({"questions": {"p0": {}}}, {"answers": {}})

    def test_nan_fails(self):
        value = answer("supports", float("nan"))
        with self.assertRaises(ValueError):
            check.validate_answers({"questions": {"p0": {}}}, {"answers": {"p0": value}})

    def test_service_error_stays_in_denominator(self):
        result = check.summarize([{"error": "HTTP 429"}, {"answers": {}, "expected": "not_stated"}], .8)
        self.assertEqual(result["coverage"], .5)
        self.assertEqual(result["errors"], 1)

    def test_empty_input_never_calls_api(self):
        with patch("urllib.request.urlopen", side_effect=AssertionError("Network called")):
            result = check.run_case({"id": "empty", "expected": "not_stated", "claim": "X", "passages": []}, check.MODEL, "unused")
        self.assertFalse(result["api_called"])


if __name__ == "__main__":
    unittest.main()
