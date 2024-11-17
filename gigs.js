// Gig operations and data handling
class GigManager {
    constructor() {
        this.database = firebase.database();
    }

    // Save gig to database
    save(gigData) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) throw new Error('User not authenticated');

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

        // Create a new gig reference with unique ID
        const gigRef = this.database.ref('gigs/' + Date.now());
        gigRef.set(gig);

        alert('Gig saved successfully!');
    }

    // Get all gigs
    get(callback) {
        const gigsRef = this.database.ref('gigs');
        gigsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const gigs = [];
            
            for(let id in data) {
                gigs.push({
                    id: id,
                    ...data[id]
                });
            }
            
            // Sort by newest first
            gigs.sort((a, b) => b.createdAt - a.createdAt);
            
            callback(gigs);
        });
    }

    // Search gigs
    search(searchTerm, callback) {
        const gigsRef = this.database.ref('gigs');
        gigsRef.orderByChild('title')
            .startAt(searchTerm)
            .endAt(searchTerm + "\uf8ff")
            .on('value', (snapshot) => {
                const data = snapshot.val();
                const gigs = [];
                
                for(let id in data) {
                    gigs.push({
                        id: id,
                        ...data[id]
                    });
                }
                
                callback(gigs);
            });
    }

    static createGigElement(gig) {
        return `
            <div class="gig-card" data-gig-id="${gig.id}">
                <div class="gig-header">
                    <img src="${escapeHtml(gig.userPicture)}" alt="${escapeHtml(gig.userName)}" class="gig-user-pic">
                    <div class="gig-user-info">
                        <div class="gig-user-name">${escapeHtml(gig.userName)}</div>
                        <div class="gig-location">${escapeHtml(gig.location)}</div>
                    </div>
                </div>
                <div class="gig-title">${escapeHtml(gig.title)}</div>
                <div class="gig-details">
                    <span class="gig-category">${escapeHtml(gig.category)}</span>
                    <span>•</span>
                    <span class="gig-price">${gig.price.toFixed(2)} €</span>
                    <span>•</span>
                    <span class="gig-status">${escapeHtml(gig.status)}</span>
                </div>
                <div class="gig-description">${escapeHtml(gig.description)}</div>
            </div>
        `;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.GigManager = GigManager; 