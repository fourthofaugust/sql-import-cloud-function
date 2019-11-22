const {google} = require("googleapis");
const {auth} = require("google-auth-library");
const sqladmin = google.sqladmin("v1beta4");

// This function is not production ready
exports.loadData = (event, context) => {
// TODO Can I use async at an event function level?
    async function triggerDataLoad(gcsEvent) {
        try {
            const authRes = await auth.getApplicationDefault();
            const authClient = authRes.credential;

            const request = {
                project: "your-project-name",
                instance: "your-sql-instance-name",
                resource: {
                    "importContext": {
                        "kind": "sql#importContext",
                        "fileType": "SQL",
                        "uri": `gs://${gcsEvent.bucket}/${gcsEvent.name}`,
                        "database": "your-db-name"
                    }
                },
                auth: authClient,
            };

            sqladmin.instances.import(request, (err, response) => {
                if (err) {
                    console.error('Error connecting to Cloud SQL');
                    console.error(err);
                    return;
                }
                console.log('Import Successful...');
                console.log(response.data);
            });

        } catch (err) {
            console.error('Error retrieving default auth credentials...);
            console.error(err);
        }
    }

    triggerDataLoad(event);

};
