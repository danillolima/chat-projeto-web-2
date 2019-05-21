var express = require('express');
var router = express.Router();
var Message = require('../model/Message');
var User = require('../model/User');

exports.create_message = function(req, res) {
    //User.findOne();
    let sender = req.session.key, recipient = req.query.id, msg = req.body.msg;
    console.log('Post: '+ recipient);
    console.log('Msg: '+ msg);

    if (req.session && req.session.key) {
        User.findOne({"user": sender}, function(err,doc){
            if(err || doc === null){
                return res.send('['+JSON.stringify({message: "Erro no banco de dados"})+']');
            }
            
            if(msg.length > 0){
                Message.create({message: msg, sender: doc.id, recipient: recipient }, function(err, doc){
                    if(err) console.log(err);
                });
            }
            res.redirect('/chat?id='+recipient);
        });
    }
    else{
        res.redirect('/');
    }

};

exports.get_all_messages = function(req, res){
    var sender = req.session.key, idRecipient = req.query.id;
    if(idRecipient == null){
        return res.send('Oops!');
    }
    User.findOne({user: sender}, function(err, doc){
        Message.find({$and:[{sender: { "$in" : [doc.id, idRecipient]}},
         {recipient: { "$in" : [doc.id, idRecipient]}}]}, function(err, docs){
            res.render('chat', { title: 'Página de mensagens', idGet: idRecipient, msgs: docs, layout: 'chat' } );
         });
    });
 };
