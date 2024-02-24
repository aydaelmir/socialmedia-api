const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Account = require('./models/account');
const Tweet = require('./models/tweet'); 
const UserRelation = require('./models/userRelation'); 
const Comment = require('./models/comment'); 
const Like = require('./models/like'); 
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
 
const uri = "mongodb+srv://ayda:aydapassword123@cluster0.bntox77.mongodb.net/SocialMediaDb?retryWrites=true&w=majority";
mongoose.connect(uri).then(()=>{
    console.log("Connected to MongoDB");
    app.listen(port);
}).catch((err)=>{console.error(err)});

app.post('/register', async (req, res) => {
    try {
        const account = new Account(req.body);
        const savedAccount = await account.save();
        console.log(savedAccount)
        res.status(200).json( {account: savedAccount} );
      } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    const user = await Account.findOne({ username, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.status(200).json(user);
});

app.get('/:userId', async(req, res) => {
    const userId = req.params.userId; 
    const user = await Account.findOne({_id: userId });
    if (!user) {
        return res.status(404).json({ message: 'Invalid username or password' });
    }
    res.status(200).json(user);
})

app.get('/tweets/:accountId', async (req, res) => {
    try {
     
        const accountId = req.params.accountId; 
        if (!accountId) {
            return res.status(400).json({ error: 'accountId is required' });
        }

        const tweets = await Tweet.find({ accountId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'accountId',
                select: 'userName avatar',
                options: {
                    as: 'userAccount'
                }
            });
        res.json(tweets);


    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/search', async (req, res) => {
    try {
        const { searchKey } = req.body;
        if(searchKey == ''){
            res.json([]);
        }
        else{
            const users = await Account.aggregate([
                {
                    $project: {
                        fullName: { $concat: [ "$firstName", " ", "$lastName" ] },
                        userName: 1,
                        avatar: 1,
                    }
                },
                {
                    $match: {
                        $or: [
                            { userName: { $regex: searchKey, $options: 'i' } },
                            { fullName: { $regex: searchKey, $options: 'i' } }
                        ]
                    }
                },
            ]);
            
            res.json(users)};
        
    


    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/fyptweets/:accountId', async (req, res) => {
    try {
        const accountId = req.params.accountId; 
        if (!accountId) {
            return res.status(400).json({ error: 'accountId is required' });
        }

        const followingRelations = await UserRelation.find({ followerId: accountId });
        const followingAccountIds = followingRelations.map(relation => relation.userId);

        console.log(followingAccountIds);

        const tweets = await Tweet.find({ accountId: { $in: followingAccountIds } })
            .sort({ createdAt: -1 })
            .populate({
                path: 'accountId',
                select: 'userName avatar',
                options: {
                    as: 'userAccount'
                }
            });

        res.json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/:tweetId', async (req, res) => {
    try {
        const tweetId = req.params.tweetId; 
        if (!tweetId) {
            return res.status(400).json({ error: 'tweetId is required' });
        }
        const comments = await Comment.find({ tweetId})
            .sort({ postedAt: -1 })
            .populate({
                path: 'userId',
                select: 'userName avatar',
                options: {
                    as: 'userAccount'
                }
            });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/tweet', async (req, res) => {
    try {
       const tweet = new Tweet({  
        accountId: req.body.accountId,
        content: req.body.content,
        nbOfComments:0,
        nbOfLikes:0,
        postedAt: new Date(),
    
    });
    await tweet.save();
       res.status(200).json(tweet);
       
    } catch (error) {
        console.error('Error posting tweet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/follow', async (req, res) => {
    try {
      const userRelation = new UserRelation(req.body)
        await userRelation.save();
       res.status(200).json(userRelation);
       
    } catch (error) {
        console.error('Error following this person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/like', async (req, res) => {
    try {
      const like = new Like(req.body)
        await like.save();
       res.status(200).json(like);
       
    } catch (error) {
        console.error('Error following this person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/comment', async (req, res) => {
    try {
      const comment = new Comment(req.body)
      comment.postedAt = new Date();
        await comment.save();
       res.status(200).json(comment);
       
    } catch (error) {
        console.error('Error following this person:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/followings/:userId', async (req, res) => {
    
    try {const userId = req.params.userId; 
    const users = await UserRelation.find({ followerId: userId });
    res.json(users)
}
catch{
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
})

app.get('/likes/:tweetId', async(req, res) => {
    try {
        const tweetId = req.params.tweetId;
        
        const likes = await Like.find({ tweetId});
        res.json(likes)

    }
    catch{
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})