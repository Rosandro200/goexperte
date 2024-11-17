// Gig operations and data handling
class GigManager {
    constructor() {
        this.database = firebase.database();
    }

    // Save gig to database
    save(gigData) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) throw new Error('User not authenticated');

        // Create a unique ID using timestamp
        const gigId = Date.now().toString();
        
        // Create the gig object
        const gig = {
            title: gigData.title,
            category: gigData.category,
            description: gigData.description,
            location: gigData.location,
            price: gigData.price,
            userId: user.email,
            userName: user.name,
            userPicture: user.picture,
            rating: 1,
            reviews: ["1"],
            status: "active",
            views: 1,
            createdAt: Date.now()
        };

        // Save to database under 'gigs' node with the unique ID
        this.database.ref('gigs/' + gigId).set(gig);
        alert('Dienstleistung erfolgreich veröffentlicht!');
    }

    // Get user's gigs
    getUserGigs(userEmail, callback) {
        var gigs_ref = this.database.ref('gigs');
        gigs_ref.orderByChild('userId').equalTo(userEmail).on('value', function(snapshot) {
            const gigs = [];
            snapshot.forEach((childSnapshot) => {
                gigs.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            callback(gigs);
        });
    }

    // Delete gig
    remove(gigId) {
        this.database.ref('gigs/' + gigId).remove();
        alert('Dienstleistung gelöscht');
    }

    // Update gig
    update(gigId, updates) {
        this.database.ref('gigs/' + gigId).update(updates);
        alert('Dienstleistung aktualisiert');
    }
}

window.GigManager = GigManager; 