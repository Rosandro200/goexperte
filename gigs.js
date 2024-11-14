// Gig operations and data handling
class GigManager {
    constructor() {
        this.database = window.database;
        if (!this.database) {
            throw new Error('Database not initialized');
        }
    }

    // Create a new gig
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

        // Create unique ID for gig
        const gigId = Date.now().toString();
        this.database.ref('gigs/' + gigId).set(gig);
        return gigId;
    }

    // Get all gigs with console logs for debugging
    get(callback) {
        console.log('Getting gigs...');
        const gigs_ref = this.database.ref('gigs');
        gigs_ref.on('value', (snapshot) => {
            console.log('Snapshot received:', snapshot.val());
            const data = snapshot.val();
            const gigs = [];
            
            if (data) {  // Add this check
                for(let id in data) {
                    gigs.push({ id, ...data[id] });
                }
                
                // Sort by createdAt in descending order
                gigs.sort((a, b) => b.createdAt - a.createdAt);
            }
            
            console.log('Processed gigs:', gigs);
            callback(gigs);
        }, (error) => {
            console.error('Error getting gigs:', error);
        });
    }

    // Search gigs
    search(searchTerm, callback) {
        const gigs_ref = this.database.ref('gigs');
        gigs_ref.orderByChild('title').startAt(searchTerm).endAt(searchTerm + "\uf8ff").on('value', (snapshot) => {
            const data = snapshot.val();
            const gigs = [];
            
            for(let id in data) {
                gigs.push({ id, ...data[id] });
            }
            
            callback(gigs);
        });
    }

    // Create HTML element for a gig
    static createGigElement(gig) {
        const ratingStars = '★'.repeat(Math.round(gig.rating)) + '☆'.repeat(5 - Math.round(gig.rating));
        
        return `
            <div class="gig-card" data-gig-id="${gig.id}">
                <div class="gig-header">
                    <img src="${escapeHtml(gig.userPicture)}" alt="${escapeHtml(gig.userName)}" class="gig-user-pic">
                    <div class="gig-user-info">
                        <div class="gig-user-name">${escapeHtml(gig.userName)}</div>
                        <div class="gig-location">${escapeHtml(gig.location)}</div>
                    </div>
                    <div class="gig-stats">
                        <div class="gig-rating">${ratingStars} (${gig.rating})</div>
                        <div class="gig-views">${gig.views} Aufrufe</div>
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

// Helper function to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Export the GigManager
window.GigManager = GigManager; 