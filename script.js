// Three.js Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x330000, 0.5);
        scene.add(ambientLight);

        // Create floating Sharingan symbols
        function createSharingan(size) {
            const sharinganGroup = new THREE.Group();
            
            // Create circle outlines
            const circleGeometry = new THREE.RingGeometry(size * 0.8, size * 0.82, 64);
            const circleMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3b3b,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
            sharinganGroup.add(circle1);
            
            const circle2 = new THREE.Mesh(
                new THREE.RingGeometry(size * 0.5, size * 0.52, 64),
                circleMaterial
            );
            sharinganGroup.add(circle2);
            
            // Center dot
            const dotGeometry = new THREE.CircleGeometry(size * 0.15, 32);
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3b3b,
                transparent: true,
                opacity: 0.5
            });
            const centerDot = new THREE.Mesh(dotGeometry, dotMaterial);
            sharinganGroup.add(centerDot);
            
            // Tomoe (comma shapes)
            for (let i = 0; i < 3; i++) {
                const tomoeShape = new THREE.Shape();
                tomoeShape.moveTo(0, 0);
                tomoeShape.bezierCurveTo(
                    size * 0.3, 0,
                    size * 0.3, size * 0.2,
                    size * 0.15, size * 0.3
                );
                tomoeShape.bezierCurveTo(
                    0, size * 0.2,
                    0, 0,
                    0, 0
                );
                
                const tomoeGeometry = new THREE.ShapeGeometry(tomoeShape);
                const tomoeMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff3b3b,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                });
                
                const tomoe = new THREE.Mesh(tomoeGeometry, tomoeMaterial);
                tomoe.position.set(size * 0.25, 0, 0);
                tomoe.rotation.z = (i * Math.PI * 2) / 3;
                sharinganGroup.add(tomoe);
            }
            
            return sharinganGroup;
        }

        // Create multiple floating sharingans
        const sharingans = [];
        for (let i = 0; i < 5; i++) {
            const size = 1 + Math.random() * 1.5;
            const sharingan = createSharingan(size);
            sharingan.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20,
                -15 - Math.random() * 15
            );
            sharingan.rotation.z = Math.random() * Math.PI * 2;
            sharingans.push({
                mesh: sharingan,
                baseX: sharingan.position.x,
                baseY: sharingan.position.y,
                speed: 0.001 + Math.random() * 0.002
            });
            scene.add(sharingan);
        }

        // Create hexagonal grid pattern
        function createHexagon(radius) {
            const shape = new THREE.Shape();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                if (i === 0) {
                    shape.moveTo(x, y);
                } else {
                    shape.lineTo(x, y);
                }
            }
            shape.closePath();
            return shape;
        }

        const hexagons = [];
        for (let i = 0; i < 15; i++) {
            const hexShape = createHexagon(0.5 + Math.random() * 1);
            const hexGeometry = new THREE.ShapeGeometry(hexShape);
            const hexMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3b3b,
                transparent: true,
                opacity: 0.05,
                side: THREE.DoubleSide,
                wireframe: false
            });
            
            const hexMesh = new THREE.Mesh(hexGeometry, hexMaterial);
            hexMesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                -20 - Math.random() * 10
            );
            hexMesh.rotation.z = Math.random() * Math.PI * 2;
            
            // Store outline
            const outlineGeometry = new THREE.EdgesGeometry(hexGeometry);
            const outlineMaterial = new THREE.LineBasicMaterial({
                color: 0xff3b3b,
                transparent: true,
                opacity: 0.2
            });
            const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
            hexMesh.add(outline);
            
            hexagons.push({
                mesh: hexMesh,
                baseX: hexMesh.position.x,
                baseY: hexMesh.position.y,
                rotationSpeed: 0.001 + Math.random() * 0.002
            });
            scene.add(hexMesh);
        }

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xff3b3b,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Create red leaves
        function createLeaf() {
            const leafShape = new THREE.Shape();
            
            // Create a leaf shape using bezier curves
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.3, 0.1, 0.5, 0.3, 0.4, 0.6);
            leafShape.bezierCurveTo(0.35, 0.8, 0.2, 1, 0, 1);
            leafShape.bezierCurveTo(-0.2, 1, -0.35, 0.8, -0.4, 0.6);
            leafShape.bezierCurveTo(-0.5, 0.3, -0.3, 0.1, 0, 0);
            
            const leafGeometry = new THREE.ShapeGeometry(leafShape);
            const leafMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3b3b,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            // Add a center vein to the leaf
            const veinGeometry = new THREE.BufferGeometry();
            const veinPoints = new Float32Array([
                0, 0, 0,
                0, 1, 0
            ]);
            veinGeometry.setAttribute('position', new THREE.BufferAttribute(veinPoints, 3));
            const veinMaterial = new THREE.LineBasicMaterial({
                color: 0xcc0000,
                transparent: true,
                opacity: 0.8
            });
            const vein = new THREE.Line(veinGeometry, veinMaterial);
            leaf.add(vein);
            
            return leaf;
        }

        // Create multiple leaves
        const leaves = [];
        for (let i = 0; i < 20; i++) {
            const leaf = createLeaf();
            const size = 0.3 + Math.random() * 0.4;
            leaf.scale.set(size, size, size);
            
            leaf.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                -5 - Math.random() * 15
            );
            
            leaf.rotation.x = Math.random() * Math.PI;
            leaf.rotation.y = Math.random() * Math.PI;
            leaf.rotation.z = Math.random() * Math.PI * 2;
            
            leaves.push({
                mesh: leaf,
                speedX: (Math.random() - 0.5) * 0.02,
                speedY: -0.01 - Math.random() * 0.02,
                rotationSpeedX: (Math.random() - 0.5) * 0.02,
                rotationSpeedY: (Math.random() - 0.5) * 0.02,
                rotationSpeedZ: (Math.random() - 0.5) * 0.03,
                swayAmount: Math.random() * 2 + 1,
                swaySpeed: Math.random() * 0.5 + 0.5
            });
            scene.add(leaf);
        }

        camera.position.z = 10;

        // Mouse movement tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            // Smooth mouse following
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            // Animate sharingans
            sharingans.forEach((item, index) => {
                // Rotate slowly
                item.mesh.rotation.z += item.speed;
                
                // Gentle floating
                item.mesh.position.y = item.baseY + Math.sin(time * 0.5 + index) * 1;
                item.mesh.position.x = item.baseX + Math.cos(time * 0.3 + index) * 0.5;
                
                // Subtle mouse interaction
                item.mesh.position.x += targetX * 0.5;
                item.mesh.position.y += targetY * 0.3;
                
                // Pulsing opacity
                item.mesh.children.forEach(child => {
                    if (child.material) {
                        const baseopacity = child.material.opacity;
                        child.material.opacity = baseopacity + Math.sin(time * 2 + index) * 0.1;
                    }
                });
            });

            // Animate hexagons
            hexagons.forEach((item, index) => {
                item.mesh.rotation.z += item.rotationSpeed;
                
                // Gentle floating
                item.mesh.position.y = item.baseY + Math.sin(time * 0.3 + index * 0.5) * 0.5;
                
                // Mouse parallax
                item.mesh.position.x = item.baseX + targetX * 1.5;
                item.mesh.position.y += targetY * 1;
            });

            // Animate leaves
            leaves.forEach((leaf, index) => {
                // Falling motion
                leaf.mesh.position.y += leaf.speedY;
                leaf.mesh.position.x += leaf.speedX;
                
                // Swaying motion (left-right)
                leaf.mesh.position.x += Math.sin(time * leaf.swaySpeed + index) * 0.01;
                
                // Rotation for realistic falling
                leaf.mesh.rotation.x += leaf.rotationSpeedX;
                leaf.mesh.rotation.y += leaf.rotationSpeedY;
                leaf.mesh.rotation.z += leaf.rotationSpeedZ;
                
                // Reset position when leaf goes off screen
                if (leaf.mesh.position.y < -20) {
                    leaf.mesh.position.y = 20;
                    leaf.mesh.position.x = (Math.random() - 0.5) * 40;
                }
                if (leaf.mesh.position.x < -25 || leaf.mesh.position.x > 25) {
                    leaf.mesh.position.x = (Math.random() - 0.5) * 40;
                    leaf.mesh.position.y = 20;
                }
                
                // Subtle response to mouse movement
                leaf.mesh.position.x += targetX * 0.3;
                leaf.mesh.position.y += targetY * 0.2;
            });

            // Particles follow mouse
            particlesMesh.rotation.y += 0.0005 + targetX * 0.001;
            particlesMesh.rotation.x += 0.0003 + targetY * 0.001;
            
            // Move particle system based on mouse
            particlesMesh.position.x = targetX * 2;
            particlesMesh.position.y = targetY * 2;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Typing animation for title
        const titles = [
            'Backend Developement',
            'Machine Learning',
        ];
        let currentTitleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const titleElement = document.getElementById('animated-title');
        const typingSpeed = 100; // Speed of typing
        const deletingSpeed = 50; // Speed of deleting
        const pauseTime = 2000; // Pause after typing complete

        function typeTitle() {
            const currentTitle = titles[currentTitleIndex];
            
            if (!isDeleting) {
                // Typing
                titleElement.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentTitle.length) {
                    // Finished typing, pause then start deleting
                    isDeleting = true;
                    setTimeout(typeTitle, pauseTime);
                    return;
                }
                setTimeout(typeTitle, typingSpeed);
            } else {
                // Deleting
                titleElement.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    // Finished deleting, move to next title
                    isDeleting = false;
                    currentTitleIndex = (currentTitleIndex + 1) % titles.length;
                    setTimeout(typeTitle, 500);
                    return;
                }
                setTimeout(typeTitle, deletingSpeed);
            }
        }

        // Start typing animation
        typeTitle();

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add glow to sharingan on scroll
                    const sharingans = entry.target.querySelectorAll('.sharingan');
                    sharingans.forEach(sharingan => {
                        sharingan.classList.add('sharingan-glow');
                    });
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-scale').forEach(el => {
            observer.observe(el);
        });

        // Add parallax scroll effect to section titles
        const sectionTitles = document.querySelectorAll('.section-title');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Update scroll progress bar
            const scrollProgress = document.getElementById('scroll-progress');
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrolled / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
            
            // Parallax effect on titles
            sectionTitles.forEach((title, index) => {
                const rect = title.getBoundingClientRect();
                const elementTop = rect.top + scrolled;
                const offset = (scrolled - elementTop + window.innerHeight) * 0.1;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    title.style.transform = `translateX(${offset}px)`;
                }
            });
        });

        // Sharingan hover effect
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const sharingan = this.querySelector('.sharingan');
                if (sharingan) {
                    sharingan.style.animation = 'sharinganPulse 0.5s ease-in-out';
                }
            });

            card.addEventListener('mouseleave', function() {
                const sharingan = this.querySelector('.sharingan');
                if (sharingan) {
                    sharingan.style.animation = '';
                }
            });
        });