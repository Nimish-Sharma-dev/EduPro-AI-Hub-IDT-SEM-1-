export interface PortfolioData {
    name: string;
    title: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    about: string;
    skills: string[];
    projects: Array<{
        name: string;
        description: string;
        technologies: string;
        link?: string;
    }>;
    experience: Array<{
        company: string;
        position: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        year: string;
    }>;
}

export function generatePortfolioHTML(data: PortfolioData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>${data.name}</h1>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h2>${data.title}</h2>
            <p>${data.about}</p>
            <div class="cta-buttons">
                <a href="#contact" class="btn btn-primary">Get in Touch</a>
                <a href="${data.github}" target="_blank" class="btn btn-secondary">View GitHub</a>
            </div>
        </div>
    </section>

    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <p class="about-text">${data.about}</p>
            <div class="skills">
                <h3>Skills</h3>
                <div class="skills-grid">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
    </section>

    <section id="projects" class="section section-alt">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                <div class="project-card">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <p class="tech-stack"><strong>Technologies:</strong> ${project.technologies}</p>
                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project →</a>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                <div class="timeline-item">
                    <h3>${exp.position}</h3>
                    <h4>${exp.company}</h4>
                    <p class="duration">${exp.duration}</p>
                    <p>${exp.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="education" class="section section-alt">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-list">
                ${data.education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree}</h3>
                    <h4>${edu.institution}</h4>
                    <p>${edu.year}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">Get in Touch</h2>
            <div class="contact-info">
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>GitHub:</strong> <a href="${data.github}" target="_blank">${data.github}</a></p>
                <p><strong>LinkedIn:</strong> <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></p>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

export function generatePortfolioCSS(): string {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --secondary: #64748b;
    --text: #1e293b;
    --text-light: #64748b;
    --bg: #ffffff;
    --bg-alt: #f8fafc;
    --border: #e2e8f0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--bg);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header */
header {
    background: var(--bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav h1 {
    font-size: 1.5rem;
    color: var(--primary);
}

nav ul {
    display: flex;
    gap: 2rem;
    list-style: none;
}

nav a {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    transition: color 0.3s;
}

nav a:hover {
    color: var(--primary);
}

/* Hero */
.hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 6rem 2rem;
    text-align: center;
}

.hero-content h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    display: inline-block;
}

.btn-primary {
    background: white;
    color: var(--primary);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: var(--primary);
}

/* Sections */
.section {
    padding: 4rem 0;
}

.section-alt {
    background: var(--bg-alt);
}

.section-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

/* About */
.about-text {
    font-size: 1.125rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.skills h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
}

.skill-tag {
    background: var(--primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
}

/* Projects */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: var(--bg);
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.tech-stack {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.project-link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
    margin-top: 1rem;
}

/* Timeline */
.timeline {
    max-width: 800px;
    margin: 0 auto;
}

.timeline-item {
    padding: 1.5rem;
    border-left: 3px solid var(--primary);
    margin-bottom: 2rem;
    padding-left: 2rem;
}

.timeline-item h3 {
    color: var(--primary);
    margin-bottom: 0.25rem;
}

.timeline-item h4 {
    color: var(--text-light);
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.duration {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

/* Education */
.education-list {
    max-width: 800px;
    margin: 0 auto;
}

.education-item {
    background: var(--bg);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.education-item h3 {
    color: var(--primary);
    margin-bottom: 0.25rem;
}

.education-item h4 {
    color: var(--text-light);
    font-weight: 500;
}

/* Contact */
.contact-info {
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.125rem;
}

.contact-info p {
    margin-bottom: 1rem;
}

.contact-info a {
    color: var(--primary);
    text-decoration: none;
}

.contact-info a:hover {
    text-decoration: underline;
}

/* Footer */
footer {
    background: var(--text);
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }

    nav ul {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }

    .hero-content h2 {
        font-size: 2rem;
    }

    .cta-buttons {
        flex-direction: column;
    }

    .section-title {
        font-size: 2rem;
    }
}`;
}
