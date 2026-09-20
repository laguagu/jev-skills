import unittest
from unittest.mock import patch
import lab


def answer(label, confidence=0.95):
    return {"type": "choice", "choice": label, "confidence": confidence,
            "probabilities": {key: 1.0 if key == label else 0.0 for key in lab.CRITERIA}}


class Decisions(unittest.TestCase):
    def test_absence_is_not_negative(self):
        self.assertEqual(lab.compose({"p0": answer("irrelevant")}, .8), "not_stated")

    def test_conflicts_are_preserved(self):
        self.assertEqual(lab.compose({"p0": answer("supports"), "p1": answer("contradicts")}, .8), "conflicting")

    def test_uncertainty_escalates(self):
        self.assertEqual(lab.compose({"p0": answer("supports", .4)}, .8), "review")

    def test_labels_never_enter_request(self):
        body = lab.request_body({"id": "private-label", "expected": "supported", "claim": "X", "passages": ["Y"]})
        self.assertNotIn("expected", str(body))
        self.assertNotIn("private-label", str(body))

    def test_incomplete_answer_fails(self):
        with self.assertRaises(ValueError):
            lab.validate_answers({"questions": {"p0": {}}}, {"answers": {}})

    def test_nan_fails(self):
        value = answer("supports", float("nan"))
        with self.assertRaises(ValueError):
            lab.validate_answers({"questions": {"p0": {}}}, {"answers": {"p0": value}})

    def test_service_error_stays_in_denominator(self):
        result = lab.summarize([{"error": "HTTP 429"}, {"answers": {}, "expected": "not_stated"}], .8)
        self.assertEqual(result["coverage"], .5)
        self.assertEqual(result["errors"], 1)

    def test_empty_input_never_calls_api(self):
        with patch("urllib.request.urlopen", side_effect=AssertionError("Network called")):
            result = lab.run_case({"id": "empty", "expected": "not_stated", "claim": "X", "passages": []}, lab.MODEL, "unused")
        self.assertFalse(result["api_called"])


if __name__ == "__main__":
    unittest.main()
