import { eval_what, default_var_dict } from "whatlang-interpreter"

const $$$ = document.getElementById.bind(document)
const codeBox = $$$("codebox")
const runBtn = $$$("run")
const output = $$$("output")
function run() {
  output.textContent = ""
  let time = Date.now()
  const h = setInterval(() => {
    time = Date.now()
  }, 1000)
  eval_what(
    /*code*/ codeBox.value,
    /*fstack*/ [[]],
    /*var_dict*/ {
      ...default_var_dict,
      [Symbol.for("whatlang.dead_loop_check")]() {
        if (Date.now() - time > 5000) return true
      }
    },
    /*output*/ t => output.textContent += t
  ).catch(e => {
    const div = document.createElement("div")
    div.style.color = "red"
    div.textContent = e instanceof Error ? String(e) : `Exception: ${e}`
    output.appendChild(div)
  }).finally(() => {
    clearInterval(h)
  })
}

runBtn.onclick = run
document.addEventListener("keydown", ev => {
  if (ev.key == "F5") {
    ev.preventDefault()
    run()
  }
})
