// const mongoose=require('mongoose');
import mongoose from 'mongoose';
import dns from 'dns';

// Force public DNS servers for Node SRV lookup when local DNS is unreliable
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const ConfigureDB = async function () {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("connected to db");
  } catch (err) {
    console.error("error connecting to db", err);
    console.error(
      "MongoDB Atlas SRV lookup failed. Make sure your network allows DNS SRV queries and your Atlas cluster IP access list is configured."
    );
  }
};

export default ConfigureDB;