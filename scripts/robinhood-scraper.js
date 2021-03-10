(async function() {
    let c = true;
    while (c) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 500));
        c = document.getElementsByClassName("css-1bzksmt").length > 0;
    }
})().then(() => {
    function download() {
        function summary_to_obj(el) {
            let current_details = {};
            let sum_details = el.getElementsByClassName(
                "_2SYphfY1DF71e5bReqgDyP"
            );
            for (let param of sum_details) {
                let prop = param.getElementsByClassName("css-6e9jx2")[0]
                    .textContent;
                let data = param.getElementsByClassName("css-6e9jx2")[1]
                    .textContent;
                current_details[prop] = data;
            }
            return current_details;
        }

        function objectfy_trade(el) {
            let type = el
                .getElementsByClassName("_2VPzNpwfga_8Mcn-DCUwug")[0]
                .getElementsByTagName("h3")[0].textContent;
            let status = el
                .getElementsByClassName("_22YwnO0XVSevsIC6rD9HS3")[0]
                .getElementsByTagName("h3")[0].textContent;
            if (status != "Canceled") {
                let obj = {};
                obj.description = type;

                let summary = el.getElementsByClassName("grid-3")[0];
                obj.summary = summary_to_obj(summary);

                let legs = el.getElementsByClassName("css-178yklu");
                if (legs.length > 0) {
                    obj.legs = [];
                    for (let leg of legs) {
                        let description = leg.getElementsByClassName(
                            "css-dbaw41"
                        )[0].textContent;
                        obj.legs.push({
                            description: description,
                            summary: summary_to_obj(leg)
                        });
                    }
                }
                return obj;
            }
            return false;
        }

        function download_obj(obj) {
            var json = JSON.stringify(obj);

            //Convert JSON string to BLOB.
            json = [json];
            var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

            var url = window.URL || window.webkitURL;
            link = url.createObjectURL(blob1);
            var a = document.createElement("a");
            a.download = "trades.json";
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        let container1 = document.getElementsByClassName(
            "_2wuDJhUh9lal-48SV5IIfk"
        )[0];
        let container2 = document.getElementsByClassName(
            "_2wuDJhUh9lal-48SV5IIfk"
        )[1];

        let return_data = [];

        let elements = container1.getElementsByClassName(
            "rh-expandable-item-a32bb9ad"
        );
        for (let el of elements) {
            let obj = objectfy_trade(el);
            if (obj) return_data.push(obj);
        }
        if (container2) {
            elements = container2.getElementsByClassName(
                "rh-expandable-item-a32bb9ad"
            );
            for (let el of elements) {
                let obj = objectfy_trade(el);
                if (obj) return_data.push(obj);
            }
        }
        download_obj(return_data);
    }
    download();
});
