const RemoveDuplicates = (files) => {
    const map = {}

    let hasDuplicates = false;
    for (let index = 0; index < files.length; index++) {
        const file = files[index]
        if (map[file.name]) {
        hasDuplicates = true;
        files.splice(index, 1);
        continue
        }

        map[file.name] = file;
    }

    return {hasDuplicates: hasDuplicates, files: files}
}


export default RemoveDuplicates