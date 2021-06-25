var express = require('express');
var router = express.Router();

router.post('/', (req: any, res: any) => {
    res.json({text: 'Analytic update'});
});

module.exports = router;