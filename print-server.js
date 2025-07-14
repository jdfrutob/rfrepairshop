const express = require("express");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const app = express();
app.use(express.json());

app.post("/print", (req, res) => {
  const { receipt } = req.body;
  if (!receipt) return res.status(400).send("No receipt data");

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(function () {
      printer
        .align("CT")
        .text("RF REPAIR SHOP")
        .text("Contact: 02-82532334")
        .text("==============================")
        .align("LT")
        .text(receipt)
        .cut()
        .close();
    });

    res.send("Printing...");
  } catch (err) {
    res.status(500).send("Printer error: " + err.message);
  }
});

app.listen(3000, () =>
  console.log("ESC/POS print server running on port 3000")
);
