import { useEffect } from "react"
import { useState } from "react"
import axois from "axios"

export function Github() {
const[jokes,setJokes] = useState([])

useEffect(()=>{
    axois.get('http://localhost:3000/jokes').then((response)=>{
        setJokes(response.data)
    }).catch((error)=>{
        console.log(error)
    })
},[])

    return (
        <section id="center">
            <h1>Github</h1>
            <h1>Jokes: {jokes.length}</h1>
            {jokes.map((joke)=>{
                return(
                    <div key={joke.id}>
                        <p>{joke.joke}</p>
                    </div>
                )
            })}

        </section>
    )
}   
