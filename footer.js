const footer = document.getElementById("footer");

footer.innerHTML = `

<footer style=" 
  background: black ;
  text-align: center; 
  padding: 40px 0; 
  color: white;
  font-size: 18px; 
  margin-top: 60px; 
  width: 100%; 
">
  <div style="display:flex; flex-wrap:wrap; justify-content:space-between; max-width:1200px; margin:auto;">
    
    <!-- Contact Info -->
    <div style="flex:1; min-width:250px; margin-bottom:20px;">
      <h3>Cura Companion</h3>
      <p>NIT Goa Kottamoll Plateau, Cuncolim <br>Salcete, South Goa, Goa - 403703</p>
      <p>Phone: +91 88990-34455</p>
      <p>Email: contact@curacompanion.com</p>
    </div>

    <!-- Quick Links -->
    <div style="flex:1; min-width:200px; margin-bottom:20px;">
      <h3>Quick Links</h3>
      <ul style="list-style:none; padding:0;">
        <li><a href="#" style="color:white; text-decoration:none;">Home</a></li>
        <li><a href="#" style="color:white; text-decoration:none;">Services</a></li>
        <li><a href="#" style="color:white; text-decoration:none;">About Us</a></li>
        <li><a href="#" style="color:white; text-decoration:none;">Contact</a></li>
      </ul>
    </div>

    <!-- Newsletter -->
    <div style="flex:1; min-width:250px; margin-bottom:20px;">
      <h3>Newsletter</h3>
      <p>Subscribe for health tips and updates:</p>
      <form>
        <input type="email" placeholder="Your Email" required
          style="padding:10px; width:100%; margin-bottom:10px; border:none; border-radius:5px;" />
        <button type="submit"
          style="padding:10px 20px; background-color:rgba(41, 152, 160, 0.6); color:white; border:none; border-radius:5px; cursor:pointer;">
          Subscribe
        </button>
      </form>
    </div>
  </div>

  <div style="text-align:center; margin-top:30px; font-size:14px;">
    © 2025 Cura Companion. All rights reserved.
  </div>
</footer>
`;