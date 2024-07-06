const renderMan = (req, res, next) => {
    const { data, view, status } = req.renderData;
    if(req.headers.accept == 'application/json'){
        res.status(status || 200).json(data);
    } else {
        res.render('root', { data, view, currentUser: req.user });
    }
};

export default renderMan;