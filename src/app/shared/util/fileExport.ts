const base64ToBlob = (b64Data, contentType, sliceSize = 512) => {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}


export class SrpFileManager {

    downloadFileFromBase64(fileReport) {
        let blob = base64ToBlob(fileReport.contentBase64, fileReport.contentType);

        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.setAttribute('style', 'display:none;')
        anchor.download = fileReport.name;
        anchor.href = url;
        anchor.click();
    }
}