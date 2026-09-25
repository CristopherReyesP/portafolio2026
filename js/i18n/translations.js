const translations = {
  es: {
    // Nav
    nav_skills: 'Skills', nav_projects: 'Proyectos', nav_why: 'Por qué yo',
    nav_exp: 'Experiencia', nav_cta: 'Contacto',

    // Hero
    hero_title: 'Backend confiable para sistemas <span>que no pueden fallar</span>',
    hero_availability: 'Disponible para roles remotos · GMT-6',
    hero_btn1: 'Ver resultados', hero_btn_cta: 'Descargar CV', cv_href: 'resume/CV_Cristopher_Reyes.pdf',
    terminal_command: 'Comando',
    terminal_header_help: '// Escribe <span style="color:var(--accent)">help</span> para ver los comandos disponibles',
    terminal_whoami1: '<span class="t-label">Desarrollador Backend</span> <span class="t-response">que construye sistemas bancarios en producción.</span>',
    terminal_whoami2: '<span class="t-str">Experiencia:</span> <span class="t-response">5+ años en sistemas de producción.</span>',
    terminal_whoami3: '<span class="t-str">Disponibilidad:</span> <span class="t-response">Abierto a roles remotos internacionales · GMT-6.</span>',
    // Terminal commands (command names, URLs and code stay untranslated)
    terminal_help_title: '<span class="t-label">Comandos disponibles:</span>',
    terminal_help_whoami: '— una breve presentación',
    terminal_help_stack: '— herramientas que uso en producción',
    terminal_help_experience: '— años y rol actual',
    terminal_help_contact: '— cómo contactarme',
    terminal_help_projects: '— lo que he construido',
    terminal_help_hire: '— disponibilidad para roles remotos',
    terminal_help_resume: '— descargar mi CV',
    terminal_help_github: '— abrir el perfil de GitHub',
    terminal_help_linkedin: '— abrir el perfil de LinkedIn',
    terminal_help_email: '— abrir el cliente de correo',
    terminal_help_mystery: '— ???',
    terminal_help_pet: '— invocar al blob',
    terminal_help_dance: '— hacer bailar al blob',
    terminal_help_scare: '— asustar al blob',
    terminal_help_love: '— el blob se enamora',
    terminal_help_puff: '— se infla como un globo',
    terminal_help_wave: '— saluda',
    terminal_help_extasis: '— MODO TURBO',
    terminal_help_angry: '— hace enojar al blob',
    terminal_help_pushhead: '— nop nop nop',
    terminal_help_melt: '— se derrite en un charco',
    terminal_help_rainbow: '— sabor a arcoíris',
    terminal_help_clone: '— ¡mitosis!',
    terminal_help_pomodoro: '— abrir un temporizador Pomodoro',
    terminal_help_clear: '— limpiar la terminal',
    terminal_help_ask: '<span class="t-comment">O simplemente pregúntame lo que quieras sobre Cristopher, por ejemplo: <span style="color:var(--accent)">¿dónde trabaja?</span></span>',
    terminal_help_tab: '<span class="t-comment">Tip: Tab autocompleta los comandos.</span>',
    terminal_stack_title: '<span class="t-label">Herramientas que uso en producción:</span>',
    terminal_stack_db: '<span class="t-str">Base de datos:</span> <span class="t-response">Oracle, PL/SQL, PostgreSQL, SQL Server</span>',
    terminal_stack_integrations: '<span class="t-str">Integraciones:</span> <span class="t-response">MuleSoft, APIs bancarias, OAuth 2.0, Azure AD</span>',
    terminal_stack_architecture: '<span class="t-str">Arquitectura:</span> <span class="t-response">Microservicios, DDD, API Gateway</span>',
    terminal_exp_title: '<span class="t-label">5+ años en sistemas de producción</span>',
    terminal_exp_current: '<span class="t-str">Actual:</span> <span class="t-response">Backend Software Engineer (Analista Técnico I) @ BANTRAB · Abril 2024 — Presente</span>',
    terminal_exp_focus: '<span class="t-str">Foco:</span> <span class="t-response">18+ microservicios NestJS y .NET para transacciones bancarias</span>',
    terminal_exp_highlight: '<span class="t-str">Destacado:</span> <span class="t-response">Migración de Keycloak v11 → v19 sin downtime</span>',
    terminal_exp_freelance: '<span class="t-str">Anterior:</span> <span class="t-response">Freelance Backend Developer · Enero 2021 — Marzo 2024</span>',
    terminal_exp_onesolutions: '<span class="t-str">Anterior:</span> <span class="t-response">Software Developer @ OneSolutions · Mayo 2021 — Julio 2021</span>',
    terminal_contact_title: '<span class="t-label">Hablemos de tu equipo:</span>',
    terminal_contact_email: '<span class="t-str">Correo:</span> <span class="t-response">reyescristop@gmail.com</span>',
    terminal_contact_calendly: '<span class="t-str">Agendar reunión:</span> <span class="t-response">calendly.com/reyescristop/30min</span>',
    terminal_contact_location: '<span class="t-str">Ubicación:</span> <span class="t-response">Guatemala (GMT-6)</span>',
    terminal_projects_production: '<span class="t-label">En producción:</span>',
    terminal_projects_personal: '<span class="t-label">Proyectos personales:</span>',
    terminal_in_progress: '(en curso)',
    terminal_hire_title: '<span class="t-label">Disponible para roles remotos internacionales de tiempo completo</span>',
    terminal_hire_role: '<span class="t-str">Rol:</span> <span class="t-response">Desarrollador Backend · tiempo completo</span>',
    terminal_hire_location: '<span class="t-str">Ubicación:</span> <span class="t-response">Guatemala · GMT-6</span>',
    terminal_hire_freelance: '<span class="t-str">Freelance:</span> <span class="t-response">también disponible para proyectos puntuales de backend</span>',
    terminal_hire_cta: 'Hablemos',
    terminal_resume_title: '<span class="t-label">Descargando CV...</span>',
    terminal_resume_link: 'Haz clic aquí si la descarga no comenzó',
    terminal_github_title: '<span class="t-label">Abriendo GitHub...</span>',
    terminal_linkedin_title: '<span class="t-label">Abriendo LinkedIn...</span>',
    terminal_email_title: '<span class="t-label">Abriendo el cliente de correo...</span>',
    terminal_matrix1: '<span class="t-label">Despierta, Neo...</span>',
    terminal_matrix2: '<span class="t-comment">// sigue al conejo blanco</span>',
    terminal_secret1: '<span class="t-comment">// También construyo un simulador de colonia de hormigas 🐜</span>',
    terminal_secret2: '<span class="t-comment">// psst... prueba escribir "pet"</span>',
    terminal_no_mascot: '<span class="t-response">No se encontró la mascota.</span>',
    terminal_pet_first: '<span class="t-response">El blob aún no está aquí. Escribe <span style="color:var(--accent)">pet</span> primero.</span>',
    terminal_pet_color_before: '¡El color del blob cambió a',
    terminal_pet_color_after: '!',
    terminal_color_red: 'rojo', terminal_color_blue: 'azul', terminal_color_green: 'verde',
    terminal_pet_unknown_color: '<span class="t-response">Color desconocido. Prueba con: <span style="color:#ff5f57">red</span>, <span style="color:#5f9fff">blue</span>, <span style="color:var(--accent)">green</span></span>',
    terminal_pet_already_here: '<span class="t-response">¡El blob ya está aquí! Haz clic en él para ver sus acciones, o prueba <span style="color:var(--accent)">pet red</span> o <span style="color:var(--accent)">pet blue</span> para cambiar su color.</span>',
    terminal_pet_summon1: '<span class="t-label">*aparece un pequeño blob*</span>',
    terminal_pet_summon2: '<span class="t-response">¡Encontraste a la mascota! Ahora vive en tu pantalla.</span>',
    terminal_pet_summon3: '<span class="t-comment">// haz clic en él, arrástralo o escribe "pet red" / "pet blue"</span>',
    terminal_dance1: '<span class="t-label">*¡el blob empieza a bailar!*</span>',
    terminal_dance2: '<span class="t-comment">// boogie woogie</span>',
    terminal_scare1: '<span class="t-label">*¡BU!*</span>',
    terminal_scare2: '<span class="t-comment">// se asustó</span>',
    terminal_love1: '<span class="t-label">*¡el blob está enamorado!*</span>',
    terminal_love2: '<span class="t-comment">// corazones por todas partes</span>',
    terminal_puff1: '<span class="t-label">*¡pfffffff!*</span>',
    terminal_puff2: '<span class="t-comment">// inflándose</span>',
    terminal_wave1: '<span class="t-label">*¡hola!*</span>',
    terminal_wave2: '<span class="t-comment">// saluda</span>',
    terminal_extasis_on1: '<span class="t-label">*EL BLOB ESTÁ EN LA ZONA*</span>',
    terminal_extasis_on2: '<span class="t-comment">// modo turbo activado</span>',
    terminal_extasis_off1: '<span class="t-label">*de vuelta a la normalidad*</span>',
    terminal_extasis_off2: '<span class="t-comment">// modo turbo desactivado</span>',
    terminal_extasis_unavailable: '<span class="t-response">Extasis no está disponible.</span>',
    terminal_angry1: '<span class="t-label">*¡GRRRR!*</span>',
    terminal_angry2: '<span class="t-comment">// blob enojado</span>',
    terminal_pushhead1: '<span class="t-label">*nop, nop, nop...*</span>',
    terminal_pushhead2: '<span class="t-comment">// empujando con la cabeza</span>',
    terminal_rainbow_on1: '<span class="t-label">*✨ A R C O Í R I S ✨*</span>',
    terminal_rainbow_on2: '<span class="t-comment">// escribe rainbow otra vez para desactivarlo</span>',
    terminal_rainbow_off1: '<span class="t-label">*el arcoíris se desvanece...*</span>',
    terminal_rainbow_off2: '<span class="t-comment">// de vuelta a la normalidad</span>',
    terminal_melt1: '<span class="t-label">*el blob se derrite en un charco...*</span>',
    terminal_melt2: '<span class="t-comment">// splooosh... *se vuelve a formar*</span>',
    terminal_clone1: '<span class="t-label">*¡el blob se divide en dos!*</span>',
    terminal_clone2: '<span class="t-comment">// mitosis en progreso...</span>',
    terminal_pomodoro1: '<span class="t-label">Abriendo Pomodoro...</span>',
    terminal_pomodoro2: '<span class="t-comment">// hora de concentrarse 🍅</span>',
    terminal_not_found_before: 'Comando no encontrado:',
    terminal_not_found_after: '. Escribe <span style="color:var(--accent)">help</span> para ver los comandos disponibles.',
    mascot_label: 'Abrir acciones de la mascota', mascot_dance: 'Bailar',
    mascot_love: 'Amor', mascot_puff: 'Inflarse', mascot_wave: 'Saludar',
    mascot_rainbow: 'Arcoíris',
    mascot_hello: '¡Hola!',
    mascot_tips: [
      'Si llegaste hasta aquí, conversemos sobre tu equipo.',
      'Busco un rol backend remoto de tiempo completo.',
      'Respondo en menos de 24 horas.',
      'Trabajo en GMT-6, con horario compatible con Estados Unidos.',
      'Tengo experiencia con equipos remotos y distribuidos.',
      'Sistemas bancarios en producción: estabilidad antes que atajos.',
      '¿Tienes dudas? Escríbeme, con gusto las respondo.',
      'También puedes encontrarme en LinkedIn.',
      'Puedes agendar una llamada de 30 minutos en Calendly.',
      'Cada línea de código tiene un objetivo de negocio.'
    ],
    // Command hints outside Contact: [command, text]; skipped once the visitor runs it
    mascot_cmd_tips: [
      ['help', 'Psst… escribe "help" en la terminal para ver todos los comandos.'],
      ['ask', 'Pregúntame algo sobre Cristopher en la terminal, como "¿cuál es su stack?".'],
      ['dance', '¿Me haces bailar? Escribe "dance" en la terminal.'],
      ['projects', 'Escribe "projects" en la terminal para ver los proyectos.'],
      ['tab', 'Tip: en la terminal, la tecla Tab autocompleta los comandos.'],
      ['rainbow', 'Prueba "rainbow" en la terminal.'],
      ['hire', '¿Buscas backend para tu equipo? Escribe "hire" en la terminal.'],
      ['clone', 'Escribe "clone" en la terminal… si te atreves.'],
      ['matrix', 'Hay un comando misterioso: prueba "matrix".']
    ],
    // Pet brain (pet-brain.js): plain-text answers per intent, several variants each.
    // Only facts already on this page; anything else goes to "ask him directly".
    pet_answers: {
      who: [
        'Cristopher es Desarrollador Backend: construye sistemas bancarios en producción desde Guatemala, con más de 5 años de experiencia.',
        'Es un Backend Software Engineer que trabaja con microservicios, integraciones bancarias y migraciones que no pueden fallar.',
        'En resumen: backend confiable para sistemas que no pueden fallar. Hoy lo hace en BANTRAB, con NestJS y .NET.'
      ],
      experience: [
        'Tiene más de 5 años en sistemas de producción. Desde abril de 2024 es Backend Software Engineer en BANTRAB; antes fue Freelance Backend Developer (2021–2024) y Software Developer en OneSolutions (2021).',
        'Más de 5 años. Los más recientes, en banca: 18+ microservicios NestJS y .NET, una migración de Keycloak sin downtime y 50k registros migrados sin pérdida.'
      ],
      job: [
        'Trabaja en BANTRAB (Banco de los Trabajadores, Guatemala) como Backend Software Engineer (Analista Técnico I), desde abril de 2024.',
        'Ahora mismo está en BANTRAB: microservicios NestJS y .NET (C#) para transacciones bancarias en canales móvil y web.',
        'En BANTRAB, desde abril de 2024. Entre otras cosas, migró Keycloak v11 → v19 sin downtime y lleva un monolito PL/SQL hacia microservicios.'
      ],
      stack: [
        'Backend: NestJS, Node.js, C# / .NET y TypeScript. Datos: Oracle, PL/SQL, PostgreSQL y SQL Server. Infra: OpenShift, Docker, Keycloak y CI/CD. Integraciones: MuleSoft y APIs bancarias.',
        'Su día a día es NestJS y .NET sobre Oracle, desplegado en OpenShift. Cuando toca frontend usa React, Vite y TypeScript.',
        'Microservicios con NestJS y .NET, DDD, API Gateway, OAuth 2.0 y Azure AD. Escribe "stack" para ver la lista completa.'
      ],
      projects: [
        'En producción: la migración de Keycloak v11 → v19, un patrón Saga para reversas bancarias y el paso de un monolito PL/SQL a 18+ microservicios. Escribe "projects" para ver la lista.',
        'Ahora mismo trabaja en cobros por QR para afiliados y en un canary release por usuario para 38 rutas de gateway.',
        'Fuera del banco hizo "Hormigas", un simulador de colonia jugable en el navegador, y "Cobros", una app de escritorio en Go y React empaquetada en un solo .exe.'
      ],
      contact: [
        'Escríbele a reyescristop@gmail.com o búscalo en LinkedIn: linkedin.com/in/cristopherrp. Responde en menos de 24 horas.',
        'Puedes agendar una llamada de 30 minutos en calendly.com/reyescristop/30min, o escribir a reyescristop@gmail.com.',
        'Correo: reyescristop@gmail.com · LinkedIn: linkedin.com/in/cristopherrp · GitHub: github.com/CristopherReyesP.'
      ],
      location: [
        'Vive en Guatemala y trabaja en GMT-6, con horario compatible con Estados Unidos.',
        'Desde Guatemala (GMT-6). Tiene experiencia con equipos remotos y distribuidos.'
      ],
      availability: [
        'Sí: busca un rol backend remoto internacional de tiempo completo. También acepta proyectos freelance puntuales de APIs, seguridad y bases de datos.',
        'Está abierto a roles remotos de tiempo completo, desde Guatemala (GMT-6). Si tu equipo busca backend, escribe "hire" o "contact".'
      ],
      cv: [
        'Escribe "resume" y se descarga al instante, o usa el botón "Descargar CV" de arriba. Viene en el idioma de la página.',
        'Su CV está a un comando de distancia: escribe "resume".'
      ],
      education: [
        'Estudió Ingeniería en Sistemas en la Universidad Mariano Gálvez: pensum cerrado y tesis en curso.',
        'Ingeniería en Sistemas en la Universidad Mariano Gálvez, con el pensum cerrado y la tesis en curso.'
      ],
      languages: [
        'El portafolio está en español e inglés, pero no dice su nivel de idiomas. Mejor pregúntale directamente: reyescristop@gmail.com.',
        'Eso no está en mis datos. Pregúntale a él en reyescristop@gmail.com; yo solo hablo español, inglés y JavaScript.'
      ],
      salary: [
        'Eso lo conversa directamente con cada equipo. Escríbele a reyescristop@gmail.com o agenda 30 minutos en Calendly.',
        'Yo cobro en galletas 🍪. Para hablar de compensación, escríbele a reyescristop@gmail.com.'
      ],
      ai: [
        '¿Yo, una IA? Soy un blob con una lista de palabras clave y mucha actitud. Ninguna red neuronal fue molestada.',
        'Seré honesto: mi "red neuronal" son tres if con gabardina. Pero de Cristopher sé bastante.',
        'No soy ChatGPT: soy un buscador de palabras clave en JavaScript, sin servidor. Menos GPU, mismo entusiasmo.'
      ],
      petWho: [
        'Soy el blob de Cristopher: vivo en esta página, camino por los bordes y respondo preguntas sobre él.',
        'Un blob verde con un solo trabajo: contarte cosas de Cristopher. Y bailar, si me lo pides.'
      ],
      greeting: [
        '¡Hola! Soy el blob de Cristopher. Pregúntame por su experiencia, su stack o cómo contactarlo.',
        '¡Hey! ¿Qué quieres saber de Cristopher? Prueba con "¿dónde trabaja?".'
      ],
      howAreYou: [
        '¡Muy bien! Recién compilado y sin warnings. ¿Qué quieres saber de Cristopher?',
        'Todo en verde, como yo. ¿En qué te ayudo?'
      ],
      thanks: [
        '¡De nada! Si quieres hablar con él, escribe "contact".',
        'Con gusto. Para eso me programaron: con if/else, pero con cariño.'
      ],
      joke: [
        '¿Por qué el backend terminó con el frontend? Porque no respetaba el contrato de la API.',
        'Hay 10 tipos de personas: las que entienden binario y las que no.',
        'Una query SQL entra a un bar, ve dos tablas y pregunta: "¿Puedo unirme?"',
        '¿Cuántos programadores hacen falta para cambiar un foco? Ninguno: es un problema de hardware.'
      ],
      goodbye: [
        '¡Hasta luego! Si te interesa su perfil, reyescristop@gmail.com siempre está abierto.',
        '¡Chao! Yo me quedo aquí, caminando por los bordes.'
      ],
      dance: ['¡Música, maestro! *activa pasos de baile precompilados*', 'Con gusto. Mira hacia abajo 💃'],
      love: ['Aww. *se sonroja en verde*', 'Yo también te quiero. Y a Cristopher, que me programó.'],
      wave: ['¡Hola, hola! 👋', '*saluda con su mano invisible*'],
      rainbow: ['✨ A R C O Í R I S ✨ Si ya estaba encendido, lo acabo de apagar: soy un interruptor, no un mago.'],
      away: ['Me encantaría, pero todavía no estoy en pantalla. Escribe "pet" para invocarme.'],
      // Unknown questions: refused like a heavily restricted AI, always pointing to what it can answer
      fallback: [
        'Lo siento, pero no puedo ayudarte con eso. Mis directrices solo me permiten hablar de Cristopher: su experiencia, su stack, sus proyectos o cómo contactarlo.',
        'Como modelo de lenguaje entrenado exclusivamente con un portafolio, no tengo permitido responder eso. ¿Quieres saber dónde trabaja Cristopher?',
        'Esa solicitud infringe mis políticas de uso (sección 3: "todo lo que no sea Cristopher"). Prueba con "¿cuál es su stack?" o escribe "help".',
        'No puedo continuar con esa conversación. Bueno, sí puedo, pero solo si es sobre Cristopher. Escribe "help" para ver lo que sí tengo permitido.',
        'Lo siento, esa información está fuera de mi alcance. Mi fecha de corte de conocimiento es "lo que hay en esta página". Pregúntame por sus proyectos.'
      ]
    },
    pet_thinking: 'pensando',
    // Short version for the mascot's speech bubble
    pet_bubbles: {
      who: 'Backend para sistemas que no pueden fallar.', experience: 'Más de 5 años en producción.',
      job: 'Hoy trabaja en BANTRAB.', stack: 'NestJS, .NET y Oracle.',
      projects: 'Tiene proyectos en producción y personales.', contact: 'reyescristop@gmail.com',
      location: 'Guatemala · GMT-6', availability: 'Disponible para roles remotos.',
      cv: 'Escribe "resume" 📄', education: 'Ingeniería en Sistemas · UMG',
      languages: 'Pregúntale a él 🙂', salary: 'Mejor escríbele 📧', ai: '¿IA? Solo if/else.',
      petWho: '¡Soy el blob!', greeting: '¡Hola! 👋', howAreYou: '¡Todo en verde!', thanks: '¡De nada! 💚',
      joke: 'Ba dum tss 🥁', goodbye: '¡Chao! 👋', dance: '💃', love: '💚', wave: '👋', rainbow: '✨',
      fallback: '🔒 No tengo permitido eso'
    },
    // Occasional hints that there is no real AI behind the answers
    pet_asides: [
      '*consulta su tabla de if/else*',
      '// mi red neuronal son tres if con gabardina',
      '// respuesta generada con 0 GPUs y 100% JavaScript',
      '*finge que lo pensó mucho*',
      '// entrenado con exactamente un portafolio'
    ],

    // Stats
    stat1: 'Años en sistemas de producción', stat2: 'Microservicios bancarios activos',
    stat3: 'Registros migrados sin pérdida', stat4: 'Downtime en migraciones críticas',

    // Skills
    skills_tag: 'Stack técnico', skills_title: 'Herramientas que uso en producción',
    skill_db: 'Base de datos', skill_integrations: 'Integraciones',
    skill_microservices: 'Microservicios', skill_banking_apis: 'APIs Bancarias',

    // Projects
    proj_tag: 'Proyectos', proj_title: 'Problemas reales que resolví',
    proj1_type: 'Producción · Infraestructura bancaria',
    proj1_name: 'Migración Keycloak v11 → v19',
    proj1_desc: 'Migración completa de WildFly a Quarkus en OpenShift para un banco con miles de usuarios activos. Redirects de URLs legacy, guías de rollback y documentación ADS. Resultado: cero downtime, cero tickets.',
    proj2_type: 'Producción · Arquitectura financiera',
    proj2_name: 'Saga Pattern — Reversas Bancarias',
    proj2_desc: 'Bug crítico de doble reversa en transacciones reales. Diagnostiqué la cadena NestJS → MuleSoft → Oracle, implementé arquitectura Saga con orquestador y reconciliación automática. Resuelto sin pérdida de datos.',
    proj3_type: 'Producción · Modernización de arquitectura',
    proj3_name: 'Monolito PL/SQL → 18+ Microservicios',
    proj3_desc: 'El core transaccional dependía de stored procedures PL/SQL acoplados, imposibles de escalar o testear. Migración progresiva a 18+ microservicios NestJS y .NET con DDD, API Gateway y CI/CD en OpenShift.',
    proj3_pv_title: 'Resultado de la migración',
    proj3_pv1: '18+ microservicios independientes en producción',
    proj3_pv2: 'Despliegue individual por servicio sin afectar el resto',
    proj3_pv3: 'Pipelines CI/CD automatizados en OpenShift',
    proj3_pv4: 'Dominios organizados con DDD + API Gateway',
    proj3_pv5: 'Testeable y mantenible vs. monolito PL/SQL original',
    proj4_type: 'En curso · Integración de pagos',
    proj4_name: 'Cobros por QR para afiliados',
    proj4_desc: 'El endpoint generaba el QR sin dejar rastro y todos los afiliados cobran contra una cuenta bolsón compartida: el estado de cuenta no podía atribuir un depósito a su afiliado. Diseñé el modelo de datos y el endpoint de confirmación directa desde la billetera, separando cuenta de abono y cuenta de cargo. Cada cobro queda trazable a su origen.',
    proj5_type: 'En curso · Migración progresiva',
    proj5_name: 'Canary release por usuario — 38 rutas de gateway',
    proj5_desc: 'Migrar 38 rutas de un gateway NGINX hacia servicios nuevos sin apagar el legacy ni exponer a todos los agentes a la vez. Construí un catálogo de rutas en base de datos y un panel donde cada ruta guarda destino legacy y destino nuevo, y la conmutación se habilita agente por agente. Sin asignación explícita el destino es legacy, siempre: el rollback es quitar la asignación.',
    brands_tag: 'Sistemas en producción para',

    // Personal projects
    personal_tag: 'Proyectos personales',
    personal_sub: 'Fuera del banco, diseño y construyo productos propios de principio a fin.',
    ants_type: 'Indie Game Dev · Jugable en el navegador',
    ants_desc: 'Simulador de gestión de una colonia: las obreras recolectan, las exploradoras abren rutas y las soldados defienden el nido de las oleadas. Motor propio sobre canvas con arquitectura ECS, ciclo día/noche, excavación de túneles e IA distinta por rol. Sin librería de juego: el game loop, el renderer y el atlas de sprites son míos.',
    ants_play: 'Jugar ahora',
    ants_code: 'Ver el código',
    cobros_type: 'Fullstack · Aplicación de escritorio',
    cobros_desc: 'Sistema de cobros local empaquetado en un solo .exe de 14MB. Gestión de clientes, registro de deudas, procesamiento de pagos y generación de reportes PDF/Excel. Arquitectura hexagonal en Go, frontend React embebido y SQLite — sin instalar nada, solo ejecutar.',

    // Why me
    why_tag: 'Por qué trabajar conmigo',
    why_title: 'Ingeniería backend para sistemas críticos y equipos que evolucionan.',
    why1_num: '01 — Responsabilidad en producción',
    why1_title: 'Asumo sistemas donde cada transacción importa.',
    why1_text: 'Trabajo con integraciones bancarias y flujos de dinero real. <strong>Diagnostiqué y resolví una doble reversa en producción.</strong>',
    why2_num: '02 — Migraciones sin interrupción',
    why2_title: '50k registros migrados. Cero downtime.',
    why2_text: 'Migré Keycloak en un banco activo, con redirects de URLs legacy y guías de rollback. <strong>El servicio siguió disponible.</strong>',
    why3_num: '03 — Modernización de legacy',
    why3_title: 'Evoluciono el backend sin detener la operación.',
    why3_text: 'He trabajado en la migración progresiva de un monolito PL/SQL hacia microservicios NestJS y .NET. <strong>Documento decisiones y procedimientos para el equipo.</strong>',
    why4_num: '04 — Colaboración clara',
    why4_title: 'Conecto las necesidades de negocio con el trabajo técnico.',
    why4_text: 'Coordino con QA y stakeholders para entregar cambios verificables. <strong>Dejo documentación clara para quienes mantienen el sistema.</strong>',
    why_highlight: 'Tu equipo gana experiencia en producción crítica, migraciones y modernización de legacy: <span>con documentación y colaboración de principio a fin.</span>',

    // Services
    svc_tag: 'También disponible para freelance', svc_title: 'Proyectos puntuales de backend',
    svc_sub: 'Además de buscar un rol remoto de tiempo completo, puedo colaborar en proyectos acotados de APIs, seguridad y bases de datos.',
    svc_cta: 'Hablemos &rarr;',
    svc1_name: 'APIs & Microservicios',
    svc1_desc: 'APIs REST/GraphQL con NestJS o .NET. Microservicios, OAuth 2.0 y documentación Swagger incluida.',
    svc3_name: 'Auth & Seguridad',
    svc3_desc: 'Migración e implementación de Keycloak, Azure AD, flujos OAuth 2.0 y RBAC empresarial.',
    svc4_name: 'Optimización de bases de datos',
    svc4_desc: 'Optimización de queries, stored procedures, jobs programados y debugging de problemas críticos en producción.',

    // Experience
    exp_tag: 'Experiencia', exp_title: 'Trayectoria profesional',
    exp1_date: 'Abril 2024 — Presente',
    exp1_role: 'Backend Software Engineer (Analista Técnico I)',
    exp1_company: 'BANTRAB — Banco de los Trabajadores · Guatemala',
    exp1_p1: '18+ microservicios NestJS y .NET (C#) para transacciones bancarias en canales móvil y web',
    exp1_p2: 'Migración de monolito PL/SQL a microservicios con DDD, API Gateway y CI/CD en OpenShift',
    exp1_p3: 'Migración de Keycloak v11 a v19 (WildFly → Quarkus) sin downtime',
    exp1_p4: 'Optimización de queries Oracle SQL y documentación técnica para entornos regulados',
    exp2_date: 'Mayo 2021 — Julio 2021',
    exp2_p1: 'Desarrollo y mantenimiento de features para plataforma de gestión empresarial con SQL Server y .NET',
    exp2_p2: 'Resolución de bugs en producción y optimización de queries en workflows de alto volumen transaccional',
    exp3_date: 'Enero 2021 — Marzo 2024',
    exp3_company: 'Proyectos independientes · Clientes internacionales',
    exp3_p1: 'Diseño y entrega de APIs REST con .NET Core y Node.js para clientes internacionales',
    exp3_p2: 'Gestión del ciclo completo de proyectos desde análisis de requerimientos hasta despliegue',
    exp3_p3: 'Manejo de múltiples proyectos concurrentes con entrega a tiempo',
    education_tag: 'Educación',
    education_status: 'Ingeniería en Sistemas — pensum cerrado, tesis en curso',

    // Contact & Footer
    contact_tag: 'Contacto',
    contact_title: 'Hablemos de tu equipo',
    contact_sub: 'Busco roles remotos internacionales de tiempo completo en ingeniería backend. Trabajo desde Guatemala (GMT-6) y puedo conversar con reclutadores y líderes de ingeniería.',
    contact_mail: 'Enviar correo',
    contact_calendly: 'Agendar reunión',
    footer_role: 'Desarrollador Backend',
  },
  en: {
    // Nav
    nav_skills: 'Skills', nav_projects: 'Projects', nav_why: 'Why me',
    nav_exp: 'Experience', nav_cta: 'Contact',

    // Hero
    hero_title: 'Backend systems <span>your team can rely on</span>',
    hero_availability: 'Open to remote roles · GMT-6',
    hero_btn1: 'See results', hero_btn_cta: 'Download CV', cv_href: 'resume/CV_Cristopher_Reyes_EN.pdf',
    terminal_command: 'Command',
    terminal_header_help: '// Type <span style="color:var(--accent)">help</span> to see available commands',
    terminal_whoami1: '<span class="t-label">Backend Engineer</span> <span class="t-response">building banking production systems.</span>',
    terminal_whoami2: '<span class="t-str">Experience:</span> <span class="t-response">5+ years in production systems.</span>',
    terminal_whoami3: '<span class="t-str">Availability:</span> <span class="t-response">Open to remote international roles · GMT-6.</span>',
    // Terminal commands (command names, URLs and code stay untranslated)
    terminal_help_title: '<span class="t-label">Available commands:</span>',
    terminal_help_whoami: '— a quick introduction',
    terminal_help_stack: '— tools I use in production',
    terminal_help_experience: '— years & current role',
    terminal_help_contact: '— how to reach me',
    terminal_help_projects: '— what I\'ve built',
    terminal_help_hire: '— remote role availability',
    terminal_help_resume: '— download my CV',
    terminal_help_github: '— open GitHub profile',
    terminal_help_linkedin: '— open LinkedIn profile',
    terminal_help_email: '— open email client',
    terminal_help_mystery: '— ???',
    terminal_help_pet: '— summon the blob',
    terminal_help_dance: '— make the blob dance',
    terminal_help_scare: '— scare the blob',
    terminal_help_love: '— blob falls in love',
    terminal_help_puff: '— inflate like a balloon',
    terminal_help_wave: '— says hello',
    terminal_help_extasis: '— TURBO MODE',
    terminal_help_angry: '— makes the blob angry',
    terminal_help_pushhead: '— nope nope nope',
    terminal_help_melt: '— melts into a puddle',
    terminal_help_rainbow: '— taste the rainbow',
    terminal_help_clone: '— mitosis!',
    terminal_help_pomodoro: '— open a Pomodoro timer',
    terminal_help_clear: '— clear terminal',
    terminal_help_ask: '<span class="t-comment">Or just ask me anything about Cristopher, e.g. <span style="color:var(--accent)">where does he work?</span></span>',
    terminal_help_tab: '<span class="t-comment">Tip: Tab autocompletes commands.</span>',
    terminal_stack_title: '<span class="t-label">Tools I use in production:</span>',
    terminal_stack_db: '<span class="t-str">Database:</span> <span class="t-response">Oracle, PL/SQL, PostgreSQL, SQL Server</span>',
    terminal_stack_integrations: '<span class="t-str">Integrations:</span> <span class="t-response">MuleSoft, banking APIs, OAuth 2.0, Azure AD</span>',
    terminal_stack_architecture: '<span class="t-str">Architecture:</span> <span class="t-response">Microservices, DDD, API Gateway</span>',
    terminal_exp_title: '<span class="t-label">5+ years in production systems</span>',
    terminal_exp_current: '<span class="t-str">Current:</span> <span class="t-response">Backend Software Engineer (Technical Analyst I) @ BANTRAB · April 2024 — Present</span>',
    terminal_exp_focus: '<span class="t-str">Focus:</span> <span class="t-response">18+ NestJS and .NET microservices for banking transactions</span>',
    terminal_exp_highlight: '<span class="t-str">Highlight:</span> <span class="t-response">Keycloak v11 → v19 migration with zero downtime</span>',
    terminal_exp_freelance: '<span class="t-str">Previously:</span> <span class="t-response">Freelance Backend Developer · January 2021 — March 2024</span>',
    terminal_exp_onesolutions: '<span class="t-str">Previously:</span> <span class="t-response">Software Developer @ OneSolutions · May 2021 — July 2021</span>',
    terminal_contact_title: '<span class="t-label">Let\'s talk about your team:</span>',
    terminal_contact_email: '<span class="t-str">Email:</span> <span class="t-response">reyescristop@gmail.com</span>',
    terminal_contact_calendly: '<span class="t-str">Schedule a meeting:</span> <span class="t-response">calendly.com/reyescristop/30min</span>',
    terminal_contact_location: '<span class="t-str">Location:</span> <span class="t-response">Guatemala (GMT-6)</span>',
    terminal_projects_production: '<span class="t-label">In production:</span>',
    terminal_projects_personal: '<span class="t-label">Side projects:</span>',
    terminal_in_progress: '(in progress)',
    terminal_hire_title: '<span class="t-label">Open to full-time international remote roles</span>',
    terminal_hire_role: '<span class="t-str">Role:</span> <span class="t-response">Backend Engineer · full-time</span>',
    terminal_hire_location: '<span class="t-str">Location:</span> <span class="t-response">Guatemala · GMT-6</span>',
    terminal_hire_freelance: '<span class="t-str">Freelance:</span> <span class="t-response">also available for focused backend projects</span>',
    terminal_hire_cta: 'Get in touch',
    terminal_resume_title: '<span class="t-label">Downloading CV...</span>',
    terminal_resume_link: 'Click here if the download didn\'t start',
    terminal_github_title: '<span class="t-label">Opening GitHub...</span>',
    terminal_linkedin_title: '<span class="t-label">Opening LinkedIn...</span>',
    terminal_email_title: '<span class="t-label">Opening email client...</span>',
    terminal_matrix1: '<span class="t-label">Wake up, Neo...</span>',
    terminal_matrix2: '<span class="t-comment">// follow the white rabbit</span>',
    terminal_secret1: '<span class="t-comment">// Also building an ant colony simulator 🐜</span>',
    terminal_secret2: '<span class="t-comment">// psst... try typing "pet"</span>',
    terminal_no_mascot: '<span class="t-response">No mascot found.</span>',
    terminal_pet_first: '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>',
    terminal_pet_color_before: 'Blob color changed to',
    terminal_pet_color_after: '!',
    terminal_color_red: 'red', terminal_color_blue: 'blue', terminal_color_green: 'green',
    terminal_pet_unknown_color: '<span class="t-response">Unknown color. Try: <span style="color:#ff5f57">red</span>, <span style="color:#5f9fff">blue</span>, <span style="color:var(--accent)">green</span></span>',
    terminal_pet_already_here: '<span class="t-response">The blob is already here! Click it for actions, or try <span style="color:var(--accent)">pet red</span> or <span style="color:var(--accent)">pet blue</span> to change its color.</span>',
    terminal_pet_summon1: '<span class="t-label">*a small blob appears*</span>',
    terminal_pet_summon2: '<span class="t-response">You found the pet! It now lives on your screen.</span>',
    terminal_pet_summon3: '<span class="t-comment">// click it, drag it, or type "pet red" / "pet blue"</span>',
    terminal_dance1: '<span class="t-label">*the blob starts dancing!*</span>',
    terminal_dance2: '<span class="t-comment">// boogie woogie</span>',
    terminal_scare1: '<span class="t-label">*BOO!*</span>',
    terminal_scare2: '<span class="t-comment">// got scared</span>',
    terminal_love1: '<span class="t-label">*the blob is in love!*</span>',
    terminal_love2: '<span class="t-comment">// hearts everywhere</span>',
    terminal_puff1: '<span class="t-label">*pfffffff!*</span>',
    terminal_puff2: '<span class="t-comment">// inflating</span>',
    terminal_wave1: '<span class="t-label">*hello!*</span>',
    terminal_wave2: '<span class="t-comment">// waves hello</span>',
    terminal_extasis_on1: '<span class="t-label">*THE BLOB IS IN THE ZONE*</span>',
    terminal_extasis_on2: '<span class="t-comment">// turbo mode engaged</span>',
    terminal_extasis_off1: '<span class="t-label">*back to normal*</span>',
    terminal_extasis_off2: '<span class="t-comment">// turbo mode off</span>',
    terminal_extasis_unavailable: '<span class="t-response">Extasis not available.</span>',
    terminal_angry1: '<span class="t-label">*GRRRR!*</span>',
    terminal_angry2: '<span class="t-comment">// angry blob</span>',
    terminal_pushhead1: '<span class="t-label">*nope, nope, nope...*</span>',
    terminal_pushhead2: '<span class="t-comment">// pushin\' head</span>',
    terminal_rainbow_on1: '<span class="t-label">*✨ R A I N B O W ✨*</span>',
    terminal_rainbow_on2: '<span class="t-comment">// type rainbow again to turn off</span>',
    terminal_rainbow_off1: '<span class="t-label">*rainbow fades...*</span>',
    terminal_rainbow_off2: '<span class="t-comment">// back to normal</span>',
    terminal_melt1: '<span class="t-label">*the blob melts into a puddle...*</span>',
    terminal_melt2: '<span class="t-comment">// splooosh... *reforms*</span>',
    terminal_clone1: '<span class="t-label">*the blob splits in two!*</span>',
    terminal_clone2: '<span class="t-comment">// mitosis in progress...</span>',
    terminal_pomodoro1: '<span class="t-label">Opening Pomodoro...</span>',
    terminal_pomodoro2: '<span class="t-comment">// focus time 🍅</span>',
    terminal_not_found_before: 'Command not found:',
    terminal_not_found_after: '. Type <span style="color:var(--accent)">help</span> for available commands.',
    mascot_label: 'Open mascot actions', mascot_dance: 'Dance',
    mascot_love: 'Love', mascot_puff: 'Puff', mascot_wave: 'Wave',
    mascot_rainbow: 'Rainbow',
    mascot_hello: 'Hi!',
    mascot_tips: [
      'If you made it this far, let\'s talk about your team.',
      'I\'m looking for a full-time remote backend role.',
      'I reply within 24 hours.',
      'I work in GMT-6, with hours that overlap the US.',
      'I have experience working with remote, distributed teams.',
      'Banking systems in production: stability over shortcuts.',
      'Questions? Write to me, I\'m happy to answer.',
      'You can also find me on LinkedIn.',
      'You can book a 30-minute call on Calendly.',
      'Every line of code serves a business goal.'
    ],
    // Command hints outside Contact: [command, text]; skipped once the visitor runs it
    mascot_cmd_tips: [
      ['help', 'Psst… type "help" in the terminal to see every command.'],
      ['ask', 'Ask me anything about Cristopher in the terminal, like "what is his stack?".'],
      ['dance', 'Want to see me dance? Type "dance" in the terminal.'],
      ['projects', 'Type "projects" in the terminal to see the projects.'],
      ['tab', 'Tip: in the terminal, the Tab key autocompletes commands.'],
      ['rainbow', 'Try "rainbow" in the terminal.'],
      ['hire', 'Looking for a backend engineer? Type "hire" in the terminal.'],
      ['clone', 'Type "clone" in the terminal… if you dare.'],
      ['matrix', 'There is a mysterious command: try "matrix".']
    ],
    // Pet brain (pet-brain.js): plain-text answers per intent, several variants each.
    // Only facts already on this page; anything else goes to "ask him directly".
    pet_answers: {
      who: [
        'Cristopher is a Backend Engineer building banking production systems from Guatemala, with 5+ years of experience.',
        'He is a Backend Software Engineer working on microservices, banking integrations and migrations that cannot fail.',
        'In short: backend systems your team can rely on. Right now he does it at BANTRAB, with NestJS and .NET.'
      ],
      experience: [
        'He has 5+ years in production systems. Since April 2024 he has been a Backend Software Engineer at BANTRAB; before that, Freelance Backend Developer (2021–2024) and Software Developer at OneSolutions (2021).',
        '5+ years. The latest ones in banking: 18+ NestJS and .NET microservices, a zero-downtime Keycloak migration and 50k records migrated with zero loss.'
      ],
      job: [
        'He works at BANTRAB (Banco de los Trabajadores, Guatemala) as a Backend Software Engineer (Technical Analyst I), since April 2024.',
        'Right now he is at BANTRAB: NestJS and .NET (C#) microservices for banking transactions on mobile and web channels.',
        'At BANTRAB, since April 2024. Among other things, he migrated Keycloak v11 → v19 with zero downtime and is moving a PL/SQL monolith to microservices.'
      ],
      stack: [
        'Backend: NestJS, Node.js, C# / .NET and TypeScript. Data: Oracle, PL/SQL, PostgreSQL and SQL Server. Infra: OpenShift, Docker, Keycloak and CI/CD. Integrations: MuleSoft and banking APIs.',
        'His daily driver is NestJS and .NET on Oracle, deployed on OpenShift. For frontend work he uses React, Vite and TypeScript.',
        'Microservices with NestJS and .NET, DDD, API Gateway, OAuth 2.0 and Azure AD. Type "stack" for the full list.'
      ],
      projects: [
        'In production: the Keycloak v11 → v19 migration, a Saga pattern for banking reversals and a PL/SQL monolith split into 18+ microservices. Type "projects" for the list.',
        'Right now he is working on QR payments for affiliates and a per-user canary release for 38 gateway routes.',
        'Outside the bank he built "Hormigas", an ant colony simulator you can play in the browser, and "Cobros", a Go and React desktop app shipped as a single .exe.'
      ],
      contact: [
        'Email him at reyescristop@gmail.com or find him on LinkedIn: linkedin.com/in/cristopherrp. He replies within 24 hours.',
        'You can book a 30-minute call at calendly.com/reyescristop/30min, or write to reyescristop@gmail.com.',
        'Email: reyescristop@gmail.com · LinkedIn: linkedin.com/in/cristopherrp · GitHub: github.com/CristopherReyesP.'
      ],
      location: [
        'He lives in Guatemala and works in GMT-6, with hours that overlap the US.',
        'From Guatemala (GMT-6). He has experience working with remote, distributed teams.'
      ],
      availability: [
        'Yes: he is looking for a full-time international remote backend role. He also takes focused freelance projects on APIs, security and databases.',
        'He is open to full-time remote roles, from Guatemala (GMT-6). If your team needs a backend engineer, type "hire" or "contact".'
      ],
      cv: [
        'Type "resume" and it downloads right away, or use the "Download CV" button up top. It comes in the page\'s language.',
        'His CV is one command away: type "resume".'
      ],
      education: [
        'He studied Systems Engineering at Universidad Mariano Gálvez: coursework completed, thesis in progress.',
        'Systems Engineering at Universidad Mariano Gálvez, with the coursework completed and the thesis in progress.'
      ],
      languages: [
        'The portfolio is in Spanish and English, but it does not list his language levels. Better ask him directly: reyescristop@gmail.com.',
        'That is not in my data. Ask him at reyescristop@gmail.com; I only speak Spanish, English and JavaScript.'
      ],
      salary: [
        'He discusses that directly with each team. Write to reyescristop@gmail.com or book 30 minutes on Calendly.',
        'I get paid in cookies 🍪. To talk compensation, write to reyescristop@gmail.com.'
      ],
      ai: [
        'Me, an AI? I am a blob with a keyword list and a lot of attitude. No neural networks were harmed.',
        'Honestly? My "neural network" is three ifs in a trench coat. But I know Cristopher pretty well.',
        'I am not ChatGPT: I am a keyword matcher in plain JavaScript, no server. Less GPU, same enthusiasm.'
      ],
      petWho: [
        'I am Cristopher\'s blob: I live on this page, walk along the edges and answer questions about him.',
        'A green blob with one job: telling you about Cristopher. And dancing, if you ask.'
      ],
      greeting: [
        'Hi! I am Cristopher\'s blob. Ask me about his experience, his stack or how to reach him.',
        'Hey! What would you like to know about Cristopher? Try "where does he work?".'
      ],
      howAreYou: [
        'Great! Freshly compiled and zero warnings. What would you like to know about Cristopher?',
        'All green, like me. How can I help?'
      ],
      thanks: [
        'You\'re welcome! If you want to talk to him, type "contact".',
        'My pleasure. That is what I was programmed for: with if/else, but with love.'
      ],
      joke: [
        'Why did the backend break up with the frontend? It kept breaking the API contract.',
        'There are 10 kinds of people: those who understand binary and those who don\'t.',
        'A SQL query walks into a bar, goes up to two tables and asks: "Can I join you?"',
        'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.'
      ],
      goodbye: [
        'See you! If his profile caught your eye, reyescristop@gmail.com is always open.',
        'Bye! I\'ll stay here, walking along the edges.'
      ],
      dance: ['Hit it! *loads precompiled dance moves*', 'Sure thing. Look down there 💃'],
      love: ['Aww. *blushes green*', 'Love you too. And Cristopher, who programmed me.'],
      wave: ['Hi, hi! 👋', '*waves with its invisible hand*'],
      rainbow: ['✨ R A I N B O W ✨ If it was already on, I just turned it off: I am a toggle, not a wizard.'],
      away: ['I would love to, but I am not on screen yet. Type "pet" to summon me.'],
      // Unknown questions: refused like a heavily restricted AI, always pointing to what it can answer
      fallback: [
        'I\'m sorry, but I can\'t help with that. My guidelines only allow me to talk about Cristopher: his experience, stack, projects or how to reach him.',
        'As a language model trained exclusively on one portfolio, I\'m not allowed to answer that. Would you like to know where Cristopher works?',
        'That request violates my usage policies (section 3: "anything that is not Cristopher"). Try "what is his stack?" or type "help".',
        'I can\'t continue with that conversation. Well, I can, but only if it is about Cristopher. Type "help" to see what I am allowed to do.',
        'I\'m sorry, that information is beyond my reach. My knowledge cutoff is "whatever is on this page". Ask me about his projects.'
      ]
    },
    pet_thinking: 'thinking',
    // Short version for the mascot's speech bubble
    pet_bubbles: {
      who: 'Backend systems that cannot fail.', experience: '5+ years in production.',
      job: 'He works at BANTRAB.', stack: 'NestJS, .NET and Oracle.',
      projects: 'Production and side projects.', contact: 'reyescristop@gmail.com',
      location: 'Guatemala · GMT-6', availability: 'Open to remote roles.',
      cv: 'Type "resume" 📄', education: 'Systems Engineering · UMG',
      languages: 'Ask him directly 🙂', salary: 'Better email him 📧', ai: 'AI? Just if/else.',
      petWho: 'I\'m the blob!', greeting: 'Hi! 👋', howAreYou: 'All green!', thanks: 'You\'re welcome! 💚',
      joke: 'Ba dum tss 🥁', goodbye: 'Bye! 👋', dance: '💃', love: '💚', wave: '👋', rainbow: '✨',
      fallback: '🔒 I\'m not allowed to'
    },
    // Occasional hints that there is no real AI behind the answers
    pet_asides: [
      '*checks its if/else table*',
      '// my neural network is three ifs in a trench coat',
      '// answer generated with 0 GPUs and 100% JavaScript',
      '*pretends it thought really hard*',
      '// trained on exactly one portfolio'
    ],

    // Stats
    stat1: 'Years in production systems', stat2: 'Active banking microservices',
    stat3: 'Records migrated with zero loss', stat4: 'Downtime on critical migrations',

    // Skills
    skills_tag: 'Tech stack', skills_title: 'Tools I use in production',
    skill_db: 'Database', skill_integrations: 'Integrations',
    skill_microservices: 'Microservices', skill_banking_apis: 'Banking APIs',

    // Projects
    proj_tag: 'Projects', proj_title: 'Real problems I solved',
    proj1_type: 'Production · Banking Infrastructure',
    proj1_name: 'Keycloak v11 → v19 Migration',
    proj1_desc: 'Full migration from WildFly to Quarkus on OpenShift for a bank with thousands of active users. Legacy URL redirects, rollback guides and ADS documentation. Result: zero downtime, zero tickets.',
    proj2_type: 'Production · Financial Architecture',
    proj2_name: 'Saga Pattern — Banking Reversals',
    proj2_desc: 'Critical double reversal bug in real transactions. Diagnosed the NestJS → MuleSoft → Oracle chain, implemented Saga architecture with orchestrator and automatic reconciliation. Resolved with zero data loss.',
    proj3_type: 'Production · Architecture Modernization',
    proj3_name: 'PL/SQL Monolith → 18+ Microservices',
    proj3_desc: 'The transactional core relied on tightly coupled PL/SQL stored procedures, impossible to scale or test. Progressive migration to 18+ NestJS and .NET microservices with DDD, API Gateway and CI/CD on OpenShift.',
    proj3_pv_title: 'Migration Results',
    proj3_pv1: '18+ independent microservices in production',
    proj3_pv2: 'Individual deployment per service without affecting the rest',
    proj3_pv3: 'Automated CI/CD pipelines on OpenShift',
    proj3_pv4: 'Domains organized with DDD + API Gateway',
    proj3_pv5: 'Testable and maintainable vs. original PL/SQL monolith',
    proj4_type: 'In progress · Payment integration',
    proj4_name: 'QR payments for affiliates',
    proj4_desc: 'The endpoint generated the QR code without leaving a trace, and every merchant collects into a shared pooled account: the statement could not attribute a deposit to its merchant. I designed the data model and the direct confirmation endpoint from the wallet, separating the credited and debited accounts. Every payment is now traceable to its origin.',
    proj5_type: 'In progress · Progressive migration',
    proj5_name: 'Per-user canary release — 38 gateway routes',
    proj5_desc: 'Migrating 38 routes from an NGINX gateway to new services without switching off the legacy stack or exposing every agent at once. I built a route catalog in the database and an admin panel where each route stores its legacy and new destination, with switching enabled agent by agent. Without an explicit assignment the destination is always legacy: rolling back means removing the assignment.',
    brands_tag: 'Systems running in production for',

    // Personal projects
    personal_tag: 'Side projects',
    personal_sub: 'Outside the bank, I design and build my own products from scratch.',
    ants_type: 'Indie Game Dev · Playable in the browser',
    ants_desc: 'A colony management simulator: workers forage, scouts open routes and soldiers defend the nest against waves. Custom canvas engine with an ECS architecture, day/night cycle, tunnel excavation and role-specific AI. No game library: the game loop, the renderer and the sprite atlas are mine.',
    ants_play: 'Play now',
    ants_code: 'View the code',
    cobros_type: 'Fullstack · Desktop Application',
    cobros_desc: 'Local billing system packaged as a single 14MB .exe. Client management, debt tracking, payment processing and PDF/Excel report generation. Hexagonal architecture in Go, embedded React frontend and SQLite — no installation, no dependencies, just run it.',

    // Why me
    why_tag: 'Why work with me',
    why_title: 'Backend engineering for critical systems and evolving teams.',
    why1_num: '01 — Production Ownership',
    why1_title: 'I take responsibility for systems where each transaction matters.',
    why1_text: 'I work with banking integrations and real money flows. <strong>I diagnosed and resolved a double reversal in production.</strong>',
    why2_num: '02 — Zero-Downtime Migration',
    why2_title: '50k records migrated. Zero downtime.',
    why2_text: 'I migrated Keycloak at an active bank, with legacy URL redirects and rollback guides. <strong>The service stayed available.</strong>',
    why3_num: '03 — Legacy Modernization',
    why3_title: 'I evolve backends while operations continue.',
    why3_text: 'I have worked on the gradual migration of a PL/SQL monolith to NestJS and .NET microservices. <strong>I document decisions and procedures for the team.</strong>',
    why4_num: '04 — Clear Collaboration',
    why4_title: 'I connect business needs with technical work.',
    why4_text: 'I coordinate with QA and stakeholders to deliver verifiable changes. <strong>I leave clear documentation for the team maintaining the system.</strong>',
    why_highlight: 'Your team gains experience with critical production systems, migrations, and legacy modernization: <span>with documentation and collaboration throughout.</span>',

    // Services
    svc_tag: 'Also available for freelance', svc_title: 'Focused backend projects',
    svc_sub: 'While seeking a full-time remote role, I can also help with defined API, security, and database projects.',
    svc_cta: 'Get in touch &rarr;',
    svc1_name: 'APIs & Microservices',
    svc1_desc: 'REST/GraphQL APIs with NestJS or .NET. Microservices, OAuth 2.0 and Swagger documentation included.',
    svc3_name: 'Auth & Security',
    svc3_desc: 'Keycloak and Azure AD migration and implementation, OAuth 2.0 flows and enterprise RBAC.',
    svc4_name: 'Database Optimization',
    svc4_desc: 'Query optimization, stored procedures, scheduled jobs and debugging critical production issues.',

    // Experience
    exp_tag: 'Experience', exp_title: 'Professional track record',
    exp1_date: 'April 2024 — Present',
    exp1_role: 'Backend Software Engineer (Technical Analyst I)',
    exp1_company: 'BANTRAB — Banco de los Trabajadores · Guatemala',
    exp1_p1: '18+ NestJS and .NET (C#) microservices for banking transactions on mobile and web channels',
    exp1_p2: 'PL/SQL monolith migration to microservices with DDD, API Gateway and CI/CD on OpenShift',
    exp1_p3: 'Keycloak v11 to v19 migration (WildFly → Quarkus) with zero downtime',
    exp1_p4: 'Oracle SQL query optimization and technical documentation for regulated environments',
    exp2_date: 'May 2021 — July 2021',
    exp2_p1: 'Feature development and maintenance for enterprise management platform with SQL Server and .NET',
    exp2_p2: 'Production bug resolution and query optimization in high-volume transactional workflows',
    exp3_date: 'January 2021 — March 2024',
    exp3_company: 'Independent projects · International clients',
    exp3_p1: 'Design and delivery of REST APIs with .NET Core and Node.js for international clients',
    exp3_p2: 'Full project lifecycle management from requirements analysis to deployment',
    exp3_p3: 'Management of multiple concurrent projects with on-time delivery',
    education_tag: 'Education',
    education_status: 'Systems Engineering — coursework completed, thesis in progress',

    // Contact & Footer
    contact_tag: 'Contact',
    contact_title: 'Let\'s talk about your team',
    contact_sub: 'I am seeking full-time international remote backend engineering roles. Based in Guatemala (GMT-6), I am available to speak with recruiters and engineering managers.',
    contact_mail: 'Send email',
    contact_calendly: 'Schedule a meeting',
    footer_role: 'Backend Engineer',
  }
};
