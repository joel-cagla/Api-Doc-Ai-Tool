@app.route('/testroute1', methods=['POST'])
def test():
    return "This test route works"

@app.route('/testroute2', methods=['POST'])
def test():
    return ("This test route works")

