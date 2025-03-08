const indexApp = require('./index.js');

const PORT = process.env.PORT || 5005;

indexApp.listen(PORT, ()=>{
    console.log(`The Localhost server Running Successfully PORT - ${PORT}`);
});