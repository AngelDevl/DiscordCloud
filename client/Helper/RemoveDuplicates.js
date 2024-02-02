const RemoveDuplicates = (files) => {
    const map = {};
    const uniqueFiles = [];
  
    let hasDuplicates = false;
  
    for (const file of files) {
      if (!map[file.name]) {
        map[file.name] = true;
        uniqueFiles.push(file);
      } else {
        hasDuplicates = true;
      }
    }
  
    return { hasDuplicates, files: uniqueFiles };
  };


export default RemoveDuplicates