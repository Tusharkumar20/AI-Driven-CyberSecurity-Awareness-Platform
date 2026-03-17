import React from "react";

function DDoS(){

return(

<div className="page ddos">

<h1>DDoS Attack</h1>

<p>
A Distributed Denial of Service (DDoS) attack attempts to make
a website or server unavailable by flooding it with large
amounts of traffic from many different devices.
</p>

<h2>How It Works</h2>

<p>
Attackers use thousands of infected computers called a
botnet to send huge numbers of requests to a server.
The server becomes overloaded and stops responding to
legitimate users.
</p>

<h2>Types of DDoS Attacks</h2>

<ul>
<li><b>Volume-Based Attacks</b> Flood network bandwidth.</li>
<li><b>Protocol Attacks</b>  Exploit weaknesses in network protocols.</li>
<li><b>Application Layer Attacks</b>Target web applications.</li>
</ul>

<h2>Prevention</h2>

<ul>
<li>Use firewalls and intrusion detection systems</li>
<li>Use Content Delivery Networks (CDN)</li>
<li>Monitor traffic regularly</li>
<li>Implement rate limiting</li>
</ul>

</div>

)

}

export default DDoS