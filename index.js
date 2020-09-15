require('dotenv').config();
const rally = require('rally');
const mainRootOID = '411765582904';
const requestOptions = {
    headers: {
        'X-RallyIntegrationName': process.env.RALLYINTEGRATIONNAME,
        'X-RallyIntegrationVendor': process.env.RALLYINTEGRATIONVENDOR,
        'X-RallyIntegrationVersion': process.env.RALLYINTEGRATIONVERSION
    }
};
// Create a Rally REST API instance, using the .env user and pw (not API key).
const restAPI = rally({
    requestOptions
});
const queryUtils = rally.util.query;
console.log(`The .env file says I am ${process.env.RALLY_USERNAME}`);
const ownTreeFrom = (rootOID, myRef) => {
    console.log(`(Sub)tree root is ${rootOID}.`);
    const rootRef = `/hierarchicalrequirement/${rootOID}`;
    const ownChildren = childrenRef => restAPI.get({
        ref: childrenRef,
        fetch: ['ObjectID']
    })
    .then(
        children => {
            const results = children.Object.Results;
            const OIDs = results.map(result => result.ObjectID);
            if (OIDs.length) {
                console.log(
                    `Children of ${rootOID} have ObjectIDs: ${
                        JSON.stringify(OIDs, null, 2)
                    }`
                );
                // Change the owner of the subtree of each child.
                // Tasks will be left unchanged.
                OIDs.forEach(OID => {
                    console.log(`Starting the subtree from ${OID}`);
                    ownTreeFrom(OID);
                });
            }
            else {
                console.log(`${rootOID} has no children.`);
            }
        },
        error => {
            console.log(
                `Error getting ${rootOID} children: ${error.message}`
            );
        }
    );
    restAPI.get({
        ref: rootRef,
        fetch: ['Owner', 'Children']
    })
    .then(
        root=> {
            const rootObject = root.Object;
            const oldOwner = rootObject.Owner;
            const oldOwnerName = oldOwner._refObjectName;
            const oldOwnerRef = oldOwner._ref;
            console.log(`Old owner ref is ${oldOwnerRef}.`);
            if (oldOwnerRef.endsWith(myRef)) {
                console.log(`I already own ${rootOID}`);
            }
            else {
                console.log(
                    `Owner of ${rootOID} will change from ${oldOwnerName} to me.`
                );
                restAPI.update({
                    ref: rootRef,
                    data: {
                        Owner: myRef
                    }
                })
                .then(
                    result => {
                        console.log(`I have become owner of ${rootOID}.`);
                        const childrenMeta = rootObject.Children;
                        const childrenRef = childrenMeta._ref;
                    },
                    error => {
                        console.log(`Error changing ${rootOID} owner: ${error.message}`);
                    }
                )
            }
        },
        error => {
            console.log(`Error getting ${rootOID} owner: ${error.message}`);
        }
    )
};
// Make me the owner of the whole tree with the specified root.
restAPI.query({
    type: 'user',
    query: queryUtils.where('UserName', '=', process.env.RALLY_USERNAME)
})
.then(
    me => {
        const myOID = me.Results[0]._ref.replace(/^.+[/]/, '');
        const myRef = `/user/${myOID}`;
        console.log(`myRef is ${myRef}.`);
        ownTreeFrom(mainRootOID, myRef);
    },
    error => {
        console.log(`Error getting me: ${error.message}`);
    }
);
/*
const myRef = '/user';
const qs = {
    query: `(UserName = ${process.env.RALLY_USERNAME})`
};
console.log(`My ref is ${myRef}`);
// const refUtils = rally.util.ref;
restAPI.get({
    ref: myRef,
    fetch: [],
    requestOptions: {
        qs
    }
})
.then(
    me => {console.log(JSON.stringify(me, null, 2))},
    error => {console.log(error.message)}
);
const rootRef = '/HierarchicalRequirement/411765582904';
const authorizedRef = `${rootRef}?key=${process.env.rallyKey}`;
console.log(`Root user-story ref: ${rootRef}`);
.then(me => {
    console.log(`My Object ID is ${JSON.stringify(me.Object, null, 2)}`);
    restAPI.get({
        ref: rootRef,
        fetch: ['DirectChildrenCount', 'Owner'],
        requestOptions
    })
    .then(rootStory => {
        const owner = rootStory.Object.Owner;
        const ownerName = owner.DisplayName;
        console.log(`Current owner: ${owner._refObjectName}`);
        console.log(`Count of its children: ${rootStory.Object.DirectChildrenCount}`);
    },
    error => {
        console.log(error.message);
    })
});
*/
