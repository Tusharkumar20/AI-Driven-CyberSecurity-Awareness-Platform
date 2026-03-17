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

useEffect(()=>{

const unsubscribe = onAuthStateChanged(auth,(firebaseUser)=>{

setUser(firebaseUser)

if(firebaseUser){

const savedPhoto = localStorage.getItem("profilePhoto")

if(savedPhoto){
setImage(savedPhoto)
}

}else{

setImage(defaultImage)

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



/* LOGOUT */

const handleLogout = async ()=>{

await signOut(auth)

localStorage.removeItem("token")
localStorage.removeItem("profilePhoto")

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