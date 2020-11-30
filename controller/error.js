exports.notFound = (req, res) => {
    if(req.session.isLoggedIn==undefined){
        req.session.isLoggedIn = false;
    }
    res.status(404).render('404',
        {
            pageTitle: 'Page not found',
            path: '/404',
            isAuthenticated: req.session.isLoggedIn
        });
};