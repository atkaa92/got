if (process.env.NODE_ENV == 'production') {
    module.exports = {
        mongoURI : 'mongodb://atkaa92:kar6670929497@ds147926.mlab.com:47926/got'
    }
}else{
    module.exports = {
        mongoURI : 'mongodb://localhost/got-dev'
    }
}