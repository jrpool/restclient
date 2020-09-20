// Import the module to keep secrets local.
require('dotenv').config();
const myName = process.env.RALLY_USERNAME;
console.log(`The .env file says I am ${myName}`);
const myRef = '/user';
// Import the Rally module.
const rally = require('rally');
const queryUtils = rally.util.query;
// Temporary initialization of the root of the tree.
const mainRootOID = '435404235956';
const mainRootRef = `/HierarchicalRequirement/${mainRootOID}`;
// Initialize the request options.
const requestOptions = {
    headers: {
        'X-RallyIntegrationName': process.env.RALLYINTEGRATIONNAME,
        'X-RallyIntegrationVendor': process.env.RALLYINTEGRATIONVENDOR,
        'X-RallyIntegrationVersion': process.env.RALLYINTEGRATIONVERSION
    }
};
/*
    Create a Rally REST API instance, using the .env user and pw
    (and not an API key).
*/
const restAPI = rally({
    requestOptions
});
/*
    Function to return a reference to the owner of the specified
    user story.
*/
const getOwnerOf = storyRef => {
    return restAPI.get({
        ref: storyRef,
        fetch: ['Owner']
    })
    .then(result => result.Object.Owner._ref);
};
/*
    Function to make the specified user the owner of the specified
    user story.
*/
const setOwnerOf = (userRef, storyRef) => restAPI.update({
    ref: storyRef,
    data: {Owner: userRef}
});
/*
    Function to return references to the child user stories of
    the specified user story.
*/
const getChildRefsOf = storyRef => {
    return restAPI.get({
        ref: storyRef,
        fetch: ['Children']
    })
    .then(
        childrenRef => restAPI.get({
            ref: childrenRef,
            fetch: ['_ref']
        })
        .then(
            children => children.Object.Results.map(result => result._ref),
            error => {
                throw `Error getting children: ${error.message}`
            }
        ),
        error => {
            throw `Error getting child OIDs: ${error.message}.`;
        }
    );
};
/*
    Function to make the specified user the owner of the (sub)tree
    rooted at the specified user story.
*/
const setOwnerOfTreeOf = (userRef, storyRef) => {
    getOwnerOf(storyRef)
    .then(ownerRef => {
        if (ownerRef !== userRef) {
            setOwnerOf(userRef, storyRef);
        }
        getChildRefsOf(storyRef)
        .then(childRefs => {
            childRefs.forEach(childRef => {
                setOwnerOfTreeOf(userRef, childRef);
            })
        })
    })
};
// Make me the owner of the tree of the specified user story.
// setOwnerOfTreeOf(myRef, mainRootRef);

/*

// Function to get a reference to a named user.
const getUserRef = userName => {
    return restAPI.query({
        type: 'user',
        query: queryUtils.where('UserName', '=', userName)
    })
    .then(
        user => user.Results[0]._ref,
        error => {
            throw `Error getting user reference: ${error.message}.`;
        }
    );
};

/*
    Function to make the specified user the owner of the (sub)tree rooted
    at the specified user story.

const ownTreeOf = (rootOID, userRef) => {
    console.log(`(Sub)tree root is ${rootOID}.`);
    const rootRef = `/hierarchicalrequirement/${rootOID}`;
    /*
        Function to make the specified user the owner of the members
        of the specified collection of children.
    
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
// Make me the owner of the whole tree rooted at the specified user story.
restAPI.query({
    type: 'user',
    query: queryUtils.where('UserName', '=', process.env.RALLY_USERNAME)
})
.then(
    me => {
        const myOID = me.Results[0]._ref.replace(/^.+[/]/, '');
        const myRef = `/user/${myOID}`;
        console.log(`myRef is ${myRef}.`);
        ownTreeOf(mainRootOID, myRef);
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
