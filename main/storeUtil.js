const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/app-config.json');
const userConfigPath = path.join(__dirname, '../config/user-config.json');  

exports.loadConfig = () => loadFromFile(configPath);

exports.loadUserConfig = () => loadFromFile(userConfigPath);

exports.saveConfig = (config) => {
  const content = JSON.stringify(config);
  if (!content) {
    return;
  }
  
  try {
    fs.writeFile(configPath, content, (err) => {
      if (err) {
        console.log("Written to file: " + configPath + " is failed; Reason: " + err);
      }
      else {
        console.log("Config written to file: " + configPath);
      }
    });    
  } catch (err) {
    console.log("Written to file: " + configPath + " is failed; Reason: " + err);
  }
}

const loadFromFile = (configPath) => {
  let content, config;
  try {
    if (fs.existsSync(configPath)) {
      content = fs.readFileSync(configPath);
    }

    if (content) {
      config = JSON.parse(content);
    }
  } catch (error) {
    throw error;
  } finally {  
    return config || {};
  }
}