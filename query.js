const mongoose = require('mongoose');
const {Schema, model} = mongoose;

//connect mongoose
mongoose.connect('mongodb://localhost/test').then( () => console.log(`Connected`))
.catch( () => console.error(`Failed`));

// schema Club Manu

const schemaClub = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

const Club = model('clubs', schemaClub);

const schemaPlayer = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    history: {
        type: Schema.Types.ObjectId,
        ref: 'clubs'
    }
})

const Player = model('players', schemaPlayer);

async function createClub(name, age){
    const club = await Club.create({
        name,
        age
    })
    console.log(`Result--Club-${club}`)
    return club;
}

async function createPlayer(name, age, history){
    const player = await Player.create({
        name,
        age,
        history
    })
    console.log(`Result--Player-${player}`)
    return player;
}

// createClub('Juve', 12);
// createPlayer('CR7', 38, '6246c2cd4708ed01420c3605')
async function getPlayer(){
    console.log( await Player.find().populate('history', 'name age -_id').select())
}

async function loopkup(){
    const player = await Player.aggregate([
        {
            $lookup:
              {
                from: 'clubs',
                localField: 'history',
                foreignField: '_id',
                as: 'clubs'
              }
        },
        {
            $unwind: '$clubs'
        },
        {
            $project: {
                clubs: {
                    name: '$clubs.name',
                    age: '$clubs.age'
                }
            }
        }
    ])

    console.log(player);
}
// getPlayer();
loopkup();