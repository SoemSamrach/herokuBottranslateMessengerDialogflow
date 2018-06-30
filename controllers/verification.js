

module.exports = (req, res) => {

    const hubChallenge = req.query['hub.challenge']
    console.log(hubChallenge)
    const hubMode = req.query['hub.mode']
    console.log(hubMode)
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'samrachgoogledialogflow')

    if (hubMode && verifyTokenMatches) {
      res.status(200).send(hubChallenge)
    } else {
      res.status(403).end()
    }
};
