"""Render a saved evaluation run as an offline, interactive HTML report."""
import argparse
import json
from pathlib import Path
from lab import compose


def render(data):
    # Compute each outcome with the SAME policy as the runner; the browser only filters.
    for row in data["rows"]:
        row["outcomes"] = ["service_error" if "error" in row else compose(row["answers"], n / 100) for n in range(101)]
    encoded = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c").replace("&", "\\u0026")
    template = '''<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Jev Evidence Lab · measured decisions</title>
<style>
:root{color-scheme:light;background:#f6f5f0;color:#202b29;font:16px/1.55 system-ui,sans-serif}
*{box-sizing:border-box}body{margin:0}main{max-width:1020px;padding:60px 24px;margin:auto}
.eyebrow{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:#52645d}h1{font-size:clamp(36px,7vw,64px);line-height:1.08;letter-spacing:-.055em;margin:18px 0}h2{font-size:18px}
.intro{max-width:680px;font-size:19px;color:#52645d}.controls{border-block:1px solid #c9d1c9;padding:24px 0;margin:32px 0 18px;display:flex;align-items:center;flex-wrap:wrap;gap:20px}
input[type=range]{width:240px;accent-color:#255f46}input:focus-visible,summary:focus-visible{outline:3px solid #33734e;outline-offset:4px}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:24px 0 36px}.metric strong{display:block;font-size:30px;letter-spacing:-.04em}.metric span,.muted{color:#596960;font-size:13px}
details{border-top:1px solid #c9d1c9;padding:18px 0}summary{cursor:pointer;display:flex;justify-content:space-between;gap:16px}summary strong{font-weight:550}.outcome{font-size:13px;white-space:nowrap;color:#245b43}
blockquote{margin:12px 0;padding:12px 16px;border-left:3px solid #778e7b;background:#eeeee6}footer{margin-top:42px;font-size:13px;color:#596960}a{color:#255f46}.error{color:#9b3527}
@media(max-width:560px){main{padding:32px 18px}.metrics{grid-template-columns:1fr 1fr}summary{flex-direction:column;gap:4px}}
</style><main><div class="eyebrow">Independent experiment · saved live results</div>
<h1>Small decisions.<br>Show the evidence.</h1>
<p class="intro">Jev judges whether supplied passages support a claim. Code preserves the original words and sends uncertain decisions for review.</p>
<p id="run" class="muted"></p>
<div class="controls"><label for="threshold">Minimum confidence <strong id="value">0.80</strong></label><input id="threshold" type="range" min="0" max="100" value="80"><label><input id="failures" type="checkbox"> Show reviews and failures only</label></div>
<div class="metrics" aria-live="polite"><div class="metric"><strong id="coverage"></strong><span>coverage of all cases</span></div><div class="metric"><strong id="accuracy"></strong><span>accuracy on accepted cases</span></div><div class="metric"><strong id="review"></strong><span>sent for review</span></div><div class="metric"><strong id="latency"></strong><span>median successful API call</span></div></div>
<p class="muted">Move the threshold to replay the policy without API calls. Confidence describes the answer distribution, not a guarantee of truth. A quotation proves source identity, not interpretation.</p>
<section id="cases" aria-label="Case results"></section>
<footer><span id="sample"></span> The bundled dataset is a synthetic demonstration, not an independent benchmark. Repetitions do not increase the number of unique examples. Missing evidence means missing from these supplied passages. No live API calls, analytics, or external assets.<br><a href="https://docs.typesafe.ai/confidence">TypeSafe confidence documentation</a></footer>
</main><script id="data" type="application/json">__DATA__</script><script>
const data=JSON.parse(document.querySelector('#data').textContent);
const el=id=>document.getElementById(id);
const text=(tag,value,className)=>{const node=document.createElement(tag);node.textContent=value;if(className)node.className=className;return node;};
el('run').textContent=`${data.returned_models.join(', ')} · ${data.created_utc.slice(0,10)} · ${data.successful_api_calls} successful calls · ${data.workers} worker(s) · estimated API cost $${data.estimated_successful_call_usd?.toFixed(6) ?? 'unknown'}`;
el('sample').textContent=`${new Set(data.rows.map(r=>r.id)).size} unique cases, ${data.repeats} repetition(s).`;
function update(){
 const threshold=Number(el('threshold').value);el('value').textContent=(threshold/100).toFixed(2);
 const rows=data.rows.map(row=>({...row,outcome:row.outcomes[threshold]}));
 const accepted=rows.filter(row=>!['review','service_error'].includes(row.outcome));
 el('coverage').textContent=(100*accepted.length/rows.length).toFixed(1)+'%';
 el('accuracy').textContent=accepted.length?(100*accepted.filter(r=>r.outcome===r.expected).length/accepted.length).toFixed(1)+'%':'—';
 el('review').textContent=rows.filter(r=>r.outcome==='review').length;
 el('latency').textContent=data.median_successful_call_seconds==null?'—':data.median_successful_call_seconds.toFixed(2)+'s';
 el('cases').replaceChildren();
 rows.forEach((row,i)=>{
  if(el('failures').checked && row.outcome===row.expected)return;
  const item=document.createElement('details'),summary=document.createElement('summary');
  summary.append(text('strong',`${i+1}. ${row.id}`),text('span',row.outcome.replaceAll('_',' '),'outcome'));item.append(summary);
  item.append(text('p',row.claim),text('p',`Expected: ${row.expected} · ${row.error?'Service error: '+row.error:row.api_called?'API '+row.seconds.toFixed(3)+'s':'Local decision'}`,'muted'));
  row.passages.forEach((passage,n)=>{const answer=row.answers?.['p'+n];item.append(text('blockquote',passage));if(answer)item.append(text('p',`${answer.choice} · confidence ${answer.confidence.toFixed(2)} · P(selected) ${answer.probabilities[answer.choice].toFixed(2)}`,'muted'));});
  if(!row.passages.length)item.append(text('p','No passages supplied. No API call.','muted'));
  el('cases').append(item);
 });
 if(!el('cases').children.length)el('cases').append(text('p','No reviews or failures at this threshold.','muted'));
}
el('threshold').addEventListener('input',update);el('failures').addEventListener('change',update);update();
</script></html>'''
    return template.replace("__DATA__", encoded)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", type=Path, default=Path("results/report.html"))
    args = parser.parse_args()
    data = json.loads(args.input.read_text(encoding="utf-8"))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(render(data), encoding="utf-8")
    print(args.out.resolve())
