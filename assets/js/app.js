// View switching logic
const views = {
    'Home': document.getElementById('home-view'),
    'Prestasi': document.getElementById('prestasi-view'),
    'FAQ': document.getElementById('faq-view')
};

const navButtons = document.querySelectorAll('nav.fixed button');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const activeLabel = btn.querySelector('span.font-label-sm').textContent.trim();

        navButtons.forEach(b => {
            const iconContainer = b.querySelector('div');
            const label = b.querySelector('span.font-label-sm');
            iconContainer.className = 'p-1 group-hover:bg-surface-container-highest rounded-full transition-all';
            label.className = 'font-label-sm text-label-sm text-on-secondary-container';
            b.className = 'flex flex-col items-center gap-1 group text-on-secondary-container';
        });
        
        const iconContainer = btn.querySelector('div');
        const label = btn.querySelector('span.font-label-sm');
        iconContainer.className = 'bg-primary-container text-on-primary-container rounded-full px-5 py-1 transition-all';
        label.className = 'font-label-sm text-label-sm text-primary font-bold';

        // Hide all views, then show the active one
        Object.values(views).forEach(v => {
            if (v) v.classList.add('hidden');
        });
        if (views[activeLabel]) {
            views[activeLabel].classList.remove('hidden');
        }
    });
});

// Fallback data for offline/local file:// protocol usage
const fallbackPrestasi = [
  {
    "id": 1,
    "category": "mahasiswa",
    "year": "2025",
    "title": "Juara 1 Gemastik Bidang Pemrograman",
    "description": "Tim mahasiswa TI UHN berhasil meraih medali emas dalam kompetisi Gemastik Nasional.",
    "icon": "emoji_events",
    "students": ["Budi Santoso", "Siti Rahma", "Ahmad Fauzi"],
    "link": "https://gemastik.kemdikbud.go.id/"
  },
  {
    "id": 2,
    "category": "prodi",
    "year": "2024",
    "title": "Akreditasi Unggul (A) BAN-PT",
    "description": "Mempertahankan peringkat akreditasi tertinggi untuk kualitas pendidikan vokasi terbaik.",
    "icon": "workspace_premium",
    "link": "https://ti.uhn.ac.id/akreditasi/"
  },
  {
    "id": 3,
    "category": "mahasiswa",
    "year": "2025",
    "title": "Juara 2 Hackathon Internasional",
    "description": "Aplikasi IoT buatan mahasiswa meraih peringkat kedua tingkat regional Asia Tenggara di Singapura.",
    "icon": "stars",
    "students": ["Kevin Wijaya", "Rian Hidayat"],
    "link": "https://hackathon.example.com/"
  },
  {
    "id": 4,
    "category": "prodi",
    "year": "2024",
    "title": "Kerja Sama Industri Google & Oracle",
    "description": "Implementasi kurikulum industri dan sertifikasi internasional untuk kompetensi lulusan global.",
    "icon": "handshake",
    "link": "https://ti.uhn.ac.id/kerjasama/"
  },
  {
    "id": 5,
    "category": "mahasiswa",
    "year": "2024",
    "title": "Juara 1 Keamanan Siber Nasional",
    "description": "Tim cyber-security prodi meraih juara 1 pada ajang Capture The Flag (CTF) tingkat nasional.",
    "icon": "security",
    "students": ["Farhan Alamsyah"],
    "link": "https://ctf.example.id/"
  },
  {
    "id": 6,
    "category": "prodi",
    "year": "2023",
    "title": "Prodi Vokasi Terpopuler Nasional",
    "description": "Mendapat penghargaan perunggu kategori program studi vokasi dengan tingkat selektivitas tertinggi.",
    "icon": "award_star",
    "link": "https://ti.uhn.ac.id/awards/"
  }
];

const fallbackFAQ = [
  {
    "id": 1,
    "question": "Bagaimana akreditasi Teknik Informatika UHN?",
    "answer": "Program Studi Sarjana Terapan Teknik Informatika Universitas Harkat Negeri telah resmi terakreditasi dengan peringkat <strong>Baik Sekali</strong> oleh Lembaga Akreditasi Mandiri Informatika dan Komputer (LAM INFOKOM)."
  },
  {
    "id": 2,
    "question": "Apakah ada beasiswa yang tersedia?",
    "answer": "Tersedia berbagai pilihan beasiswa menarik untuk mahasiswa baru maupun aktif. Informasi detail mengenai syarat dan alur pendaftaran dapat Anda cek di situs resmi <a href=\"https://pmb.harkatnegeri.ac.id/\" target=\"_blank\" class=\"text-primary hover:underline font-semibold\">PMB UHN</a> atau melalui akun Instagram <a href=\"https://www.instagram.com/daftar_harkatnegeri/\" target=\"_blank\" class=\"text-primary hover:underline font-semibold\">@daftar_harkatnegeri</a>."
  },
  {
    "id": 3,
    "question": "Berapa lama durasi kuliah dan gelarnya?",
    "answer": "Program ini ditempuh dalam waktu 4 tahun (8 semester) dengan gelar kelulusan <strong>Sarjana Terapan Komputer (S.Tr.Kom)</strong>. Gelar ini memiliki kesetaraan penuh dengan lulusan sarjana akademik (S.Kom)."
  },
  {
    "id": 4,
    "question": "Bagaimana prospek karier lulusan?",
    "answer": "Lulusan dibekali keahlian praktis tinggi untuk berkarier sebagai Software Engineer (Web/Mobile Developer), Data Scientist, DevOps Engineer, Cyber Security Specialist, Database Administrator, hingga IT Consultant."
  },
  {
    "id": 5,
    "question": "Apakah kurikulum mengikuti standar industri?",
    "answer": "Ya, kurikulum prodi dirancang bersama mitra industri terkemuka serta mengintegrasikan pelatihan sertifikasi internasional berstandar global (seperti Cisco, Oracle, Google Cloud, dan RedHat) langsung ke dalam modul pembelajaran."
  }
];

// Prestasi search and filtering logic
let prestasiData = [];
let currentFilter = 'all';

async function loadPrestasi() {
    try {
        const response = await fetch('data/prestasi.json');
        prestasiData = await response.json();
    } catch (error) {
        console.warn('Error loading prestasi.json via fetch, using local fallback data:', error);
        prestasiData = fallbackPrestasi;
    } finally {
        renderPrestasi();
    }
}

function renderPrestasi() {
    const listContainer = document.getElementById('prestasi-list');
    const searchInput = document.getElementById('prestasi-search');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const countBadge = document.getElementById('prestasi-count');
    const noResults = document.getElementById('no-prestasi-results');
    
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    let visibleCount = 0;
    
    // Sort descending (newest year first) for display
    const displayData = [...prestasiData].sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    
    displayData.forEach(item => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const category = item.category;
        
        const matchesSearch = title.includes(query) || description.includes(query);
        const matchesFilter = currentFilter === 'all' || category === currentFilter;
        
        if (matchesSearch && matchesFilter) {
            visibleCount++;
            
            // Build the card element
            const card = document.createElement('a');
            card.href = item.link || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'prestasi-item p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 active:scale-[0.99] block';
            card.setAttribute('data-category', item.category);
            
            // Icon container colors
            const iconBgClass = 'bg-primary/10';
            const iconTextClass = 'text-primary';
            
            // Category badge colors
            let badgeBgClass = '';
            let badgeTextClass = '';
            if (item.category === 'mahasiswa') {
                badgeBgClass = 'bg-primary-container/30';
                badgeTextClass = 'text-primary-container';
            } else {
                badgeBgClass = 'bg-secondary-container text-on-secondary-container';
                badgeTextClass = 'text-secondary-fixed-dim/90';
            }
            
            // Build students names markup
            let studentsMarkup = '';
            if (item.category === 'mahasiswa' && item.students && item.students.length > 0) {
                studentsMarkup = `
                    <p class="text-xs text-secondary mt-1 flex items-center gap-1 font-medium bg-surface/50 px-2 py-1 rounded w-fit border border-outline-variant/20">
                        <span class="material-symbols-outlined text-[14px]">person</span>
                        Oleh: ${item.students.join(', ')}
                    </p>
                `;
            }
            
            card.innerHTML = `
                <div class="w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined ${iconTextClass} text-[24px]">${item.icon}</span>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                    <div class="flex justify-between items-center w-full">
                        <span class="${badgeBgClass} ${badgeTextClass} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">${item.category === 'mahasiswa' ? 'Mahasiswa' : 'Prodi'}</span>
                        <span class="text-secondary text-[12px] font-semibold">${item.year}</span>
                    </div>
                    <h4 class="font-label-md text-label-md font-semibold text-on-surface">${item.title}</h4>
                    <p class="font-body-md text-body-md text-secondary text-sm">${item.description}</p>
                    ${studentsMarkup}
                </div>
            `;
            
            listContainer.appendChild(card);
        }
    });
    
    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
    
    if (countBadge) {
        countBadge.textContent = visibleCount;
    }
}

// FAQ accordion rendering and toggle logic
let faqData = [];

async function loadFAQ() {
    try {
        const response = await fetch('data/faq.json');
        faqData = await response.json();
    } catch (error) {
        console.warn('Error loading faq.json via fetch, using local fallback data:', error);
        faqData = fallbackFAQ;
    } finally {
        renderFAQ();
    }
}

function renderFAQ() {
    const listContainer = document.querySelector('#faq-view div.flex.flex-col.gap-3.mt-4');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    faqData.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden transition-all duration-200';
        
        faqItem.innerHTML = `
            <button class="faq-toggle w-full p-5 text-left flex items-center justify-between gap-4 select-none focus:outline-none">
                <span class="font-label-md text-label-md font-semibold text-primary">${item.question}</span>
                <span class="material-symbols-outlined text-[20px] text-primary transition-transform duration-200" data-icon="expand_more">expand_more</span>
            </button>
            <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-surface/50">
                <p class="font-body-md text-body-md text-secondary p-5 pt-0 text-sm leading-relaxed border-t border-outline-variant/10">
                    ${item.answer}
                </p>
            </div>
        `;
        
        // Add toggle click listener
        const toggleBtn = faqItem.querySelector('.faq-toggle');
        toggleBtn.addEventListener('click', () => {
            const content = faqItem.querySelector('.faq-content');
            const icon = toggleBtn.querySelector('.material-symbols-outlined');
            
            // Close other open FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== faqItem) {
                    const otherContent = otherItem.querySelector('.faq-content');
                    const otherIcon = otherItem.querySelector('.faq-toggle .material-symbols-outlined');
                    if (otherContent) otherContent.style.maxHeight = null;
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
        
        listContainer.appendChild(faqItem);
    });
}

// Initialization on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadPrestasi();
    loadFAQ();
    
    // Wire up search input
    const searchInput = document.getElementById('prestasi-search');
    if (searchInput) {
        searchInput.addEventListener('input', renderPrestasi);
    }
    
    // Wire up filter buttons
    const filterButtons = {
        'all': document.getElementById('filter-all'),
        'prodi': document.getElementById('filter-prodi'),
        'mahasiswa': document.getElementById('filter-mahasiswa')
    };
    
    Object.keys(filterButtons).forEach(key => {
        const btn = filterButtons[key];
        if (btn) {
            btn.addEventListener('click', () => {
                // Update active button state
                Object.values(filterButtons).forEach(b => {
                    if (b) b.className = 'px-4 py-1.5 rounded-full text-label-sm font-semibold transition-all bg-surface-container-low border border-outline-variant/30 text-secondary hover:bg-surface-container-high';
                });
                btn.className = 'px-4 py-1.5 rounded-full text-label-sm font-semibold transition-all bg-primary text-on-primary';
                
                currentFilter = key;
                renderPrestasi();
            });
        }
    });
});
