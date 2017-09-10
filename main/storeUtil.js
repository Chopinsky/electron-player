const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'config', 'app-config.json');

exports.loadConfig = () => {
  let config, content;

  try {
    if (fs.existsSync(path)) {
      content = fs.readFileSync(configPath, 'utf8');
    }

    if (content) {
      config = JSON.parse(content);
    }
  } catch (error) {
    throw error;
  } finally {
    return config;
  }
}

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

const parseDataFile = (filePath) => {

}