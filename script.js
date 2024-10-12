import { eval_what, default_var_dict } from "./whatlang_interpreter.js"
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
    /*var_dict*/ { ...default_var_dict },
    /*output*/ t => output.textContent += t,
    {
      dead_loop_check() {
        if (Date.now() - time > 5000) throw new Error("Execution time out")
      }
    }
  ).catch(e => {
    output.append(Object.assign(document.createElement("div"), {
      style: "color: red",
      textContent: e instanceof Error ? String(e) : `Exception: ${e}`
    }))
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
