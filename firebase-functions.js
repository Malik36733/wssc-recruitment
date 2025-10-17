// Firebase operations
const firestore = firebase.firestore();
const applicantsRef = firestore.collection('applicants');

// Save all applicants to Firebase
async function saveToFirebase() {
    for (const applicant of data) {
        try {
            await applicantsRef.doc(applicant.id).set(applicant);
        } catch (error) {
            console.error('Error saving applicant:', error);
        }
    }
}

// Load all applicants from Firebase
async function loadFromFirebase() {
    try {
        const snapshot = await applicantsRef.get();
        data = snapshot.docs.map(doc => doc.data());
        saveToLocalStorage();
        renderDashboard();
        renderTable();
    } catch (error) {
        console.error('Error loading data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load data from database'
        });
    }
}

// Listen for realtime updates
function setupRealtimeListener() {
    applicantsRef.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added" || change.type === "modified") {
                const applicant = change.doc.data();
                const index = data.findIndex(a => a.id === applicant.id);
                if (index === -1) {
                    data.push(applicant);
                } else {
                    data[index] = applicant;
                }
            }
            if (change.type === "removed") {
                const index = data.findIndex(a => a.id === change.doc.id);
                if (index !== -1) {
                    data.splice(index, 1);
                }
            }
        });
        saveToLocalStorage();
        renderDashboard();
        renderTable();
    });
}