const request = require('request')
const fs = require('fs')
const async = require('async')
const logUpdate = require('log-update');

function downloadsubreddit(subredditname,numofposts){
    request('https://www.reddit.com/r/jennie/.json?sort=top&t=all&limit=1000',{json: true},(err,res,body)=>{
        if (err){
            return console.log(`Can't Connect to Reddit.com`)
        }   
        if (!err && res.statusCode == 200){
            processJSON(body)
        }
    })
}


var q = async.queue(downloading,1)

q.drain(()=>{
    verifyFiles()
})

var postsdata = []

function processJSON (jsonData){
    console.log(`Got ${jsonData.data.children.length} posts`)
    jsonData.data.children.forEach(post => {
        if(post.data.is_video == false && !post.data.url_overridden_by_dest.includes('gfycat') && !post.data.url_overridden_by_dest.includes('redgifs')){
            var postObj = {
                title : post.data.title,
                url : post.data.url_overridden_by_dest,
                type : 'image',
                childrens : []
                //links : []
            }
            if(post.data.url_overridden_by_dest.includes('gallery')){
                postObj.type = 'gallery'
                postObj.childrens = Object.keys(post.data.media_metadata)
/*                 postObj.childrens.forEach(post => {
                    var link = 'https://i.redd.it/'+post+'.jpg'
                    postObj.links.push(link)
                })
 */            }
            //console.log(postObj)
            postsdata.push(postObj);
        }
    });
    //console.log(postsdata)
    sortData()
}   

var postDataObj = {
    title: '',
    url: ''
}

var postsToDownload = []

function sortData (){
    postsdata.forEach(post=>{
        if(post.type == 'image'){
            var postDataObj = {
                title: post.title+'_'+post.url.split('/')[3].split('.')[0],
                url: post.url
            }
            q.push(postDataObj)
        }
        if(post.type == 'gallery'){
            post.childrens.forEach(child=>{
                var postDataObj = {
                    title: post.title +'_'+child,
                    url: 'https://i.redd.it/'+child+'.jpg'
                }
                q.push(postDataObj)
            })
        }
    })
   // console.log(postsToDownload)
}



function downloading (postsData,cb){
    var file = request(postsData.url);
    file.pipe(fs.createWriteStream('./Images/'+postsData.title+'.jpg'));
    file.on('end',()=>{
        logUpdate('---[Downloaded] : '+postsData.title)
        cb()
    })
}

var failedFiles = []

var verQueue = async.queue(replaceFaliledFiles,1);

verQueue.drain(()=>{
    var files = fs.readdirSync('./Images');
    logUpdate(
        `
        Downloaded ${files.length} Images.

        Failed To Download -
            ${failedFiles}

        You can try manually downloading posts using above IDs.
        `
    )
})

var testimg = fs.readFileSync('./test.jpg');
function verifyFiles(){
    
    var DownloadedFiles = fs.readdirSync('./Images');
    DownloadedFiles.forEach(file=>{
        logUpdate(`Checking File : ${file}`)
        var image = fs.readFileSync('./images/'+file);
        if(image.equals(testimg)){
            verQueue.push(file)
            logUpdate(
                `Checking File : ${file}
                 Looks Defected...Retrying to Download`);
            
        }
    })
}

function replaceFaliledFiles(filename,  cb){
    //console.log("GOT REQ FOR "+filename)
    fs.unlinkSync('./Images/'+filename);
    var postID = filename.split('_')[1].split('.')[0]
    var fileReq = request( 'https://i.redd.it/'+postID+'.png');
    fileReq.pipe(fs.createWriteStream('./Images/'+filename.replace('.jpg','.png')));
    fileReq.on('end',()=>{
        var imageBuff = fs.readFileSync('./Images/'+filename.replace('.jpg','.png'));
        if(imageBuff.equals(testimg)){
            failedFiles.push(postID)
            fs.unlinkSync('./Images/'+filename.replace('.jpg','.png'))
            cb()
        }else{
            logUpdate('---[Downloaded] : '+filename.replace('.jpg','.png'))
            cb()
        }
        
    })
}

module.exports = downloadsubreddit()