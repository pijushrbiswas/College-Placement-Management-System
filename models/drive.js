const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const driveSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cp: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  ssc: {
    type: Number,
    required: true
  },
  hsc: {
    type: Number,
    required: true
  },
  be: {
    type: Number,
    required: true
  },
  cb: {
    type: Number,
    required: true
  },
  hob: {
    type: String,
    required: true
  },
  yosb: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: 'Student',
          required: true
        }
      }
    ]
  },
  batch: {
    type: String,
    required: true
  }
  
});

module.exports = mongoose.model('Drive', driveSchema);

// let drives = [];
// module.exports = class Drive {
//     constructor(id,name,cp,date,website,ssc,hsc,be,cb,hob,yosb,description) {
//         this.id=id;
//         this.name = name;
//         this.cp = cp;
//         this.date = date;
//         this.website = website;
//         this.ssc = ssc;
//         this.hsc = hsc;
//         this.be = be;
//         this.cb = cb;
//         this.hob = hob;
//         this.yosb = yosb;
//         this.description = description;

//     }

//     save() {
//         if(this.id){
//             const updatedDrives= drives.filter( d => d.id!==this.id );
//             updatedDrives.push(this);
//             drives=updatedDrives;
//         }
//         else{
//             this.id=Math.random().toString();
//             drives.push(this);
//         }
//     }

//     static fetchAll() {
//         return drives;
//     }

//     static delete(id) {
//         const updatedDrives= drives.filter( d => d.id!==id );
//         drives=updatedDrives;
//         return drives;
//     }
// }

