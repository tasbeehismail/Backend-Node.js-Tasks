const express = require("express")
const fs = require('fs');
const logger = require("morgan");
const app = express();

app.use(logger("dev"));
app.use(express.json())

const memberData = JSON.parse(fs.readFileSync('./members.json', 'utf8'));
const trainerData = JSON.parse(fs.readFileSync('./trainers.json', 'utf8'));

/* ------------------------------ Statistics's API ------------------------------*/
// Get all revenues of all members.
app.get("/allRevenues", (req, res) => {
    let totalCost = 0;
    memberData.forEach(member => {
        totalCost += member.membership.cost;
    });
    res.json(totalCost);
})
// Get the revenues of a specific trainer.
app.get("/revenues/:id", (req, res) => {
    const { id } = req.params;
    let totalCost = 0;
    memberData.forEach(member => {
        if(member.trainerId == id){
            totalCost += member.membership.cost;
        }
    });
    res.json(totalCost);
})

/* ------------------------------ Member's APIs ------------------------------*/
// Add Member (must be unique)
app.post("/addMember", (req, res) => {
    let newMember = req.body;
    newMember.id = memberData.length + 1;
    let IsUnique = true;
    memberData.forEach(member => {
        if(member.nationalId == newMember.nationalId){
            IsUnique = false;
        }
    });
    if(IsUnique){
        memberData.push(newMember);
        // Here when I used writeFileSync it change the format of json file, so this approach handle it.
        fs.writeFile('./members.json', JSON.stringify(memberData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json({ message: "Added Successfully!" });
        });        
    }else{
        res.json({message: "National id must be unique"});
    }
})
// Get all Members and Member’s Trainer
app.get("/allMembers", (req, res) => {
    const data = []
    memberData.forEach(member => {
        trainerData.forEach(trainer => {
            if(member.trainerId == trainer.id){
                data.push({member, trainer});
            }
        })
    })
    res.json(data);
})
// If a given date is expired or not function
const isExpired = (anyDate) => {
    const today = new Date()
    const toDate = new Date(anyDate);
    if(toDate.getFullYear() < today.getFullYear())
        return true;
    if(toDate.getMonth() < today.getMonth())
        return true;
    if(toDate.getDate() < today.getDate())
        return true;
    return false;
}
// Get a specific Member 
app.get("/member/:id", (req, res) => {
    const { id } = req.params;
    memberData.forEach(member => {
        if(member.id == id){
            if(isExpired(member.membership.to)){
                res.json({message: "This member is not allowed to enter the gym"});
            }else{
                res.json({message: "This member allowed to enter the gym"});
            }
        }
    })
    res.json("Done");
})
// Update Member (name, membership, trainer id)
app.patch("/updateMember/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const { membership } = req.body;
    const { trainerId } = req.body;
    const index = memberData.findIndex((member) => member.id == id);
    memberData[index].name = name;
    memberData[index].membership = membership;
    memberData[index].trainerId = trainerId;
    fs.writeFile('./members.json', JSON.stringify(memberData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: "Updated Successfully!" });
    });
})
// Delete Member (soft delete)
app.patch("/deleteMember/:id", (req, res) => {
    const { id } = req.params;
    const index = memberData.findIndex((member) => member.id == id);
    memberData[index].status = "freeze";
    fs.writeFile('./members.json', JSON.stringify(memberData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: "Deleted Successfully!" });
    });
})

/* ------------------------------ Trainer's APIs ------------------------------*/
// Add a trainer
app.post("/addTrainer", (req, res) => {
    let newTrainer = req.body;
    newTrainer.id = trainerData.length + 1;
    trainerData.push(newTrainer);
    // Here when I used writeFileSync it change the format of json file, so this approach handle it.
    fs.writeFile('./trainers.json', JSON.stringify(trainerData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: "Added Successfully!" });
    }); 
})
// Get all trainers and trainer’s members
app.get("/allTrainers", (req, res) => {
    let data = []
    trainerData.forEach(trainer => {
        let membersWithTrainer = []
        memberData.forEach(member => {
            if(member.trainerId == trainer.id){
                membersWithTrainer.push(member);
            }
        })
        data.push({trainer, membersWithTrainer});
    })
    res.json(data);
})
// Update trainer
app.patch("/updateTrainer/:id", (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;
    const index = trainerData.findIndex((trainer) => trainer.id == id);
    trainerData[index].duration = duration;
    fs.writeFile('./trainers.json', JSON.stringify(trainerData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: "Updated Successfully!" });
    });
})
// Delete trainer
app.delete("/deleteTrainer/:id", (req, res) => {
    const { id } = req.params;
    const index = trainerData.findIndex((trainer) => trainer.id == id);
    trainerData.splice(index, 1);
    fs.writeFile('./trainers.json', JSON.stringify(trainerData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: "Deleted Successfully!" });
    });
})
// Get a specific trainer and trainer’s members
app.get("/trainer/:id", (req, res) => {
    const { id } = req.params;
    const index = trainerData.findIndex((trainer) => trainer.id == id);
    let membersWithTrainer = []
    memberData.forEach(member => {
        if(member.trainerId == id){
            membersWithTrainer.push(member);
        }
    })
    let trainer = trainerData[index]
    res.json({trainer, membersWithTrainer});
})

app.listen(3000, (err) =>{
    if(err){
        console.log("Error server");
    }else{
        console.log("server running");
    }
});