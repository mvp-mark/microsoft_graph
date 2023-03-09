"use strict";
exports.__esModule = true;
var express_1 = require("express");
// import cors from "cors";
var app = (0, express_1["default"])();
// app.use(cors());
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.listen(3000, function () {
    console.log("Server started on port 3000");
});
