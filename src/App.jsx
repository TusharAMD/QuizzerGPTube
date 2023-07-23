import React, { useState, useEffect, useRef  } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [loaded,setLoaded] = useState(false)
  const options = useRef([null,null,null,null]);
  const nextbutton = useRef(null)
  const [nextq,setNextq] = useState(false);
  const [question, setQuestion] = useState("")
  const [option1, setOption1] = useState({text:"", correct:""})
  const [option2, setOption2] = useState({text:"", correct:""})
  const [option3, setOption3] = useState({text:"", correct:""})
  const [option4, setOption4] = useState({text:"", correct:""})

  useEffect(() => {
    axios.post(`http://127.0.0.1:5000/api`, { url:window.location.href })
      .then(res => {
        console.log(res);
        console.log(res.data);
        setQuestion(res.data.question)
        setOption1(res.data.option1)
        setOption2(res.data.option2)
        setOption3(res.data.option3)
        setOption4(res.data.option4)
        setLoaded(true)
      })
  }, []);

  //Use effect to handle css
  useEffect(() => {
    if (loaded){
    const quizquestionswrapper = document.querySelector(".quizquestionswrapper");
    const question = document.querySelector(".question").clientHeight;
    const options = document.querySelector(".options").clientHeight;
    const requiredHeight = question+ options + 50;
    console.log(requiredHeight)
    quizquestionswrapper.style.height = requiredHeight + "px";
    }
  }, [loaded]);

  function OptionsComponent(props){
    
    function onoptionclick(props){
      var id_no = props.id_no
      if (props.correct){
        options.current[id_no-1].style.backgroundColor = "#255957"
        const newChild = document.createElement('span');
        newChild.className = "material-symbols-outlined"
        newChild.id = "symbol"
        newChild.style.color = "#43AA8B"
        newChild.style.paddingLeft = "10px"
        newChild.innerHTML = "done" 
        options.current[id_no-1].appendChild(newChild)
        options.current[id_no-1].style.pointerEvents = "none"
        nextbutton.current.style.filter = 'none'
        nextbutton.current.style.pointerEvents = 'auto'
      }
      else{
        options.current[id_no-1].style.backgroundColor = "#255957"
        const newChild = document.createElement('span');
        newChild.className = "material-symbols-outlined"
        newChild.id = "symbol"
        newChild.style.color = "#eb8a86"
        newChild.style.paddingLeft = "10px"
        newChild.innerHTML = "close" 
        options.current[id_no-1].appendChild(newChild)
        options.current[id_no-1].style.backgroundColor = "#DB504A"
        options.current[id_no-1].style.pointerEvents = "none"
      }

    }
    return(
      <div onClick={()=>onoptionclick(props)} ref={(element)=> options.current[props.id_no-1]=element} id = {props.id_no} className='optionchoice'>
        {props.text}
      </div>
    )
  }
  if (loaded){
  return (
    <>
      <div className='quizbg'>
        <div className='quizwrapper'>
          <div className='quizheading'>Quiz</div>
          <div className='qandaparent'>
            <div className="quizquestionswrapper">
              <div className='question'>
                {question}
              </div>
              <div className='options'>
                <OptionsComponent id_no={1} text = {option1.text} correct = {option1.correct} />
                <OptionsComponent id_no={2} text = {option2.text} correct = {option2.correct} />
                <OptionsComponent id_no={3} text = {option3.text} correct = {option3.correct} />
                <OptionsComponent id_no={4} text = {option4.text} correct = {option4.correct} />
              </div>
            </div>
            
          </div>
        </div>
        <div>
          <img ref={nextbutton} onClick={()=>{
            window.location.reload();
          }} id = "nextbutton" src='https://i.ibb.co/X7GtcrZ/OIG.png'></img>
        </div>
      </div>
    </>
  )
}
else{
  return(
    <>
    <img id = "loading" src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif'></img>
    <div className='pleasewait'>
      Please wait...We are fetching your question!!
    </div>
    </>
  )
}
}

export default App
