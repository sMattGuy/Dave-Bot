async function get_wiki(){
    let params = {
        action: "query",
        format: "json",
        list: "random",
        rnlimit: "1",
        rnnamespace: "0",
    }

    let url = generate_url(params);
    return fetch(url)
        .then(function(response){return response.json();})
        .then(function(response){
            let random = response.query.random;
            params = {
                action: "query",
                format:"json",
                titles: random[0].title.replace(" ","_"),
                prop: "extracts&exintro&explaintext",
                redirects: "1",
                indexpageids: ""
            }
            let url = generate_url(params);
            return fetch(url)
                .then(function(response){return response.json();})
                .then(function(response){
                    let pageid = response.query.pageids[0];
                    return response.query.pages[`${pageid}`].extract;
                })
                .catch(function(error){console.log(error)});
        })
        .catch(function(error){console.log(error);});

    function generate_url(params){
        let url = "https://en.wikipedia.org/w/api.php";
        url = url + "?origin=*";
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
        return url;
    }
}

module.exports = {get_wiki};