const express=require("express"),
      cors=require("cors"),
      bodyParser=require("body-parser"),
      nodemailer=require("nodemailer"),
      stripe=require("stripe")(process.env.STRIPE_SECRET);

const app=express();
app.use(cors());
app.use(bodyParser.json());

const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS}
});

app.post("/send-order-email", async(req,res)=>{
  const {user, items, total, email} = req.body;
  const itemsHtml = items.map(i=>`<li>${i.name} x ${i.qty} - $${i.price}</li>`).join("");
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html:`<h3>Thanks ${user}</h3><ul>${itemsHtml}</ul><p>Total: $${total}</p>`
    });
    res.json({success:true});
  } catch(err) {
    res.status(500).json({success:false, error: err.message});
  }
});

app.listen(5000, ()=>console.log("Server running on port 5000"));
