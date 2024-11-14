// Gig operations and data handling
class GigManager {
    constructor() {
        this.db = window.db;
        if (!this.db) {
            throw new Error('Firestore not initialized');
        }
    }

    // Create a new gig
    async createGig(gigData) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not authenticated');

            const gig = {
                ...gigData,
                userId: user.email,
                userName: user.name,
                userPicture: user.picture,
                rating: 1,
                reviews: ["1"],
                status: "active",
                views: 1,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('gigs').add(gig);
            return docRef.id;
        } catch (error) {
            console.error('Error creating gig:', error);
            throw error;
        }
    }

    // Load gigs with pagination
    async loadGigs(lastDoc = null, limit = 10) {
        try {
            let query = this.db.collection('gigs')
                .orderBy('createdAt', 'desc')
                .limit(limit);

            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const snapshot = await query.get();
            const gigs = [];
            snapshot.forEach(doc => {
                gigs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return {
                gigs,
                lastDoc: snapshot.docs[snapshot.docs.length - 1],
                hasMore: snapshot.docs.length === limit
            };
        } catch (error) {
            console.error('Error loading gigs:', error);
            throw error;
        }
    }

    // Search gigs
    async searchGigs(searchTerm) {
        try {
            const snapshot = await this.db.collection('gigs')
                .orderBy('title')
                .startAt(searchTerm)
                .endAt(searchTerm + '\uf8ff')
                .get();

            const results = [];
            snapshot.forEach(doc => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return results;
        } catch (error) {
            console.error('Error searching gigs:', error);
            throw error;
        }
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
                <div class="gig-reviews">
                    <h4>Bewertungen (${gig.reviews.length})</h4>
                    ${gig.reviews.map(review => `<div class="review">${escapeHtml(review)}</div>`).join('')}
                </div>
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