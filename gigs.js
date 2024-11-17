// Gig operations and data handling
class GigManager {
    constructor() {
        this.database = firebase.database();
    }

    // Save gig to database
    save(gigData) {
        return new Promise((resolve, reject) => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) throw new Error('User not authenticated');

                // Debug log
                console.log('Creating gig with data:', gigData);

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

                // Debug log
                console.log('Final gig object:', gig);

                // Create unique ID for gig
                const gigId = Date.now().toString();
                this.database.ref('gigs/' + gigId).set(gig, (error) => {
                    if (error) {
                        console.error('Error saving gig:', error);
                        reject(error);
                    } else {
                        console.log('Gig saved successfully:', gigId);
                        alert('Dienstleistung erfolgreich veröffentlicht!');
                        window.location.href = 'index.html';
                        resolve(gigId);
                    }
                });
            } catch (error) {
                console.error('Error in save method:', error);
                reject(error);
            }
        });
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
            <div class="gig-card" data-gig-id="${gig.id}" onclick="window.location.href='gig-details.html?id=${gig.id}'">
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
                <div class="gig-actions">
                    <button class="contact-btn" onclick="contactExpert('${gig.id}', '${gig.userId}', '${gig.title}')">
                        <span class="material-icons">chat</span>
                        Experte kontaktieren
                    </button>
                </div>
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

// Add contact function
function contactExpert(gigId, expertId, gigTitle) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Create a unique chat ID combining both user IDs
    const chatId = [user.email, expertId].sort().join('_').replace(/\./g, '_');
    
    // Store chat context
    const chatContext = {
        chatId: chatId,
        gigId: gigId,
        expertId: expertId,
        gigTitle: gigTitle,
        expertName: expertId // You might want to store the expert's name here too
    };
    localStorage.setItem('currentChat', JSON.stringify(chatContext));
    window.location.href = 'messages.html';
}

window.GigManager = GigManager; 