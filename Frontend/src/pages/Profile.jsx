import { auth } from "../config/firebase"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile(){

const navigate = useNavigate()

const defaultImage =
"https://cdn-icons-png.flaticon.com/512/149/149071.png"

const [user,setUser] = useState(null)
const [image,setImage] = useState(defaultImage)
const [score,setScore] = useState(0)   // ✅ NEW

useEffect(()=>{

const unsubscribe = onAuthStateChanged(auth,(firebaseUser)=>{

setUser(firebaseUser)

if(firebaseUser){

const savedPhoto = localStorage.getItem("profilePhoto")
const savedScore = localStorage.getItem("quizScore")   // ✅ NEW

if(savedPhoto){
setImage(savedPhoto)
}

if(savedScore){
setScore(parseInt(savedScore))
}

}else{

setImage(defaultImage)
setScore(0)

}

})

return ()=>unsubscribe()

},[])



/* IMAGE UPLOAD */

const handleImageChange = (e)=>{

const file = e.target.files[0]

if(file){

const reader = new FileReader()

reader.onload = ()=>{

setImage(reader.result)

localStorage.setItem("profilePhoto",reader.result)

}

reader.readAsDataURL(file)

}

}



/* RESET SCORE */

const handleResetScore = ()=>{        // ✅ NEW
localStorage.setItem("quizScore",0)
setScore(0)
}



/* LOGOUT */

const handleLogout = async ()=>{

await signOut(auth)

localStorage.removeItem("token")
localStorage.removeItem("profilePhoto")
// ❌ don't remove score if you want to keep progress
// localStorage.removeItem("quizScore")

setUser(null)

setImage(defaultImage)

navigate("/profile")

}



return(

<div className="profile-page">

<div className="profile-card">

<h2>User Profile</h2>

<label htmlFor="upload-photo">

<img
src={image}
alt="profile"
className="profile-img"
/>

</label>

<input
type="file"
id="upload-photo"
accept="image/*"
onChange={handleImageChange}
style={{display:"none"}}
/>

<p>Click image to change photo</p>

<h3>{user ? user.displayName || "User" : "XYZ"}</h3>

<p>{user ? user.email : "Guest User"}</p>

{/* 🧠 SCORE SECTION */}
<div className="score-box">
  <h3>Quiz Score</h3>
  <p>{score} Points</p>
</div>

<button onClick={handleResetScore}>
Reset Score
</button>

{user ? (

<button className="logout-btn" onClick={handleLogout}>
Logout
</button>

):( 

<div className="profile-buttons">

<button onClick={()=>navigate("/login")}>
Sign In
</button>

<button onClick={()=>navigate("/signup")}>
Sign Up
</button>

</div>

)}

</div>

</div>

)

}