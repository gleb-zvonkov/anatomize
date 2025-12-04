// These are the local quiz questions
// They use the region type, since there is a set of questions for each region

import { Region } from "../types/types";

//They have have text question, 4 options, correct answer, and explanation for each question
export type Question = {
  text: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Quiz data for each region
export const quizData: Record<Region, Question[]> = {
  back: [
    {
      text: "Which structure protects the spinal cord?",
      options: ["Vertebral column", "Ribs", "Skull", "Scapula"],
      answer: "Vertebral column",
      explanation:
        "The vertebral column surrounds and protects the spinal cord as it descends through the vertebral canal.",
    },
    {
      text: "How many vertebrae are typically found in the human spine?",
      options: ["24", "26", "33", "35"],
      answer: "33",
      explanation:
        "There are 33 vertebrae in total—7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 fused coccygeal.",
    },
    {
      text: "Which group of muscles helps extend and stabilize the spine?",
      options: ["Erector spinae", "Deltoid", "Pectoralis major", "Trapezius"],
      answer: "Erector spinae",
      explanation:
        "The erector spinae group (iliocostalis, longissimus, spinalis) maintains posture and extends the spine.",
    },
    {
      text: "Which region of the vertebral column supports the head?",
      options: ["Cervical", "Thoracic", "Lumbar", "Sacral"],
      answer: "Cervical",
      explanation:
        "The cervical region supports and moves the head, with the atlas and axis enabling nodding and rotation.",
    },
  ],

  thorax: [
    {
      text: "Which organ is responsible for gas exchange?",
      options: ["Heart", "Lungs", "Liver", "Stomach"],
      answer: "Lungs",
      explanation:
        "Gas exchange occurs in the alveoli of the lungs, where oxygen enters blood and carbon dioxide exits.",
    },
    {
      text: "What structure separates the thorax from the abdomen?",
      options: ["Diaphragm", "Sternum", "Clavicle", "Rib cage"],
      answer: "Diaphragm",
      explanation:
        "The diaphragm is a dome-shaped muscle that separates the thoracic and abdominal cavities and aids breathing.",
    },
    {
      text: "Which bones form the protective cage of the thorax?",
      options: [
        "Ribs, sternum, thoracic vertebrae",
        "Clavicle, scapula, ribs",
        "Sternum, scapula, humerus",
        "Pelvis, ribs, sternum",
      ],
      answer: "Ribs, sternum, thoracic vertebrae",
      explanation:
        "These bones form the rib cage, protecting the heart and lungs from external injury.",
    },
    {
      text: "Which nerve controls contraction of the diaphragm?",
      options: [
        "Phrenic nerve",
        "Vagus nerve",
        "Intercostal nerve",
        "Sympathetic trunk",
      ],
      answer: "Phrenic nerve",
      explanation:
        "The phrenic nerve (C3–C5) innervates the diaphragm and is essential for respiration.",
    },
  ],

  abdomen: [
    {
      text: "Which organ produces bile?",
      options: ["Stomach", "Pancreas", "Liver", "Spleen"],
      answer: "Liver",
      explanation:
        "The liver produces bile, which emulsifies fats and aids digestion in the small intestine.",
    },
    {
      text: "Which structure connects the small and large intestines?",
      options: ["Cecum", "Appendix", "Rectum", "Pylorus"],
      answer: "Cecum",
      explanation:
        "The ileum of the small intestine opens into the cecum, the first part of the large intestine.",
    },
    {
      text: "Which muscle forms the main part of the anterior abdominal wall?",
      options: [
        "Rectus abdominis",
        "External oblique",
        "Psoas major",
        "Transversus thoracis",
      ],
      answer: "Rectus abdominis",
      explanation:
        "The rectus abdominis is a paired muscle running vertically along the abdomen; it flexes the trunk.",
    },
    {
      text: "Which vein carries nutrient-rich blood from the digestive organs to the liver?",
      options: [
        "Portal vein",
        "Inferior vena cava",
        "Hepatic vein",
        "Splenic vein",
      ],
      answer: "Portal vein",
      explanation:
        "The portal vein delivers nutrient-rich blood from the intestines to the liver for processing.",
    },
  ],

  pelvis: [
    {
      text: "Which bone forms part of the pelvic girdle?",
      options: ["Femur", "Ilium", "Tibia", "Sacrum"],
      answer: "Ilium",
      explanation:
        "The ilium is the broad, upper portion of the hip bone forming part of the pelvis.",
    },
    {
      text: "Which joint connects the right and left hip bones anteriorly?",
      options: [
        "Pubic symphysis",
        "Sacroiliac joint",
        "Coxal joint",
        "Lumbosacral joint",
      ],
      answer: "Pubic symphysis",
      explanation:
        "The pubic symphysis is a cartilaginous joint uniting the pubic bones at the front of the pelvis.",
    },
    {
      text: "Which muscle forms part of the pelvic floor?",
      options: [
        "Levator ani",
        "Rectus abdominis",
        "Gluteus maximus",
        "Psoas major",
      ],
      answer: "Levator ani",
      explanation:
        "The levator ani supports pelvic organs and controls defecation and urination.",
    },
    {
      text: "Which organ stores urine within the pelvis?",
      options: ["Bladder", "Rectum", "Uterus", "Prostate"],
      answer: "Bladder",
      explanation:
        "The urinary bladder temporarily stores urine before it exits via the urethra.",
    },
  ],

  perineum: [
    {
      text: "The perineum is located between which two structures?",
      options: [
        "Anus and genitals",
        "Liver and stomach",
        "Heart and lungs",
        "Spine and ribs",
      ],
      answer: "Anus and genitals",
      explanation:
        "The perineum lies between the pubic symphysis and coccyx, encompassing the anus and external genitals.",
    },
    {
      text: "Which muscles control defecation and urination?",
      options: [
        "Sphincter muscles",
        "Rectus muscles",
        "Oblique muscles",
        "Adductor muscles",
      ],
      answer: "Sphincter muscles",
      explanation:
        "Sphincter muscles in the perineum regulate passage of urine and feces.",
    },
    {
      text: "Which nerve supplies most perineal structures?",
      options: [
        "Pudendal nerve",
        "Femoral nerve",
        "Sciatic nerve",
        "Obturator nerve",
      ],
      answer: "Pudendal nerve",
      explanation:
        "The pudendal nerve supplies motor and sensory innervation to the perineum.",
    },
    {
      text: "Which structure forms the posterior part of the perineum?",
      options: [
        "Anal triangle",
        "Urogenital triangle",
        "Ischiorectal fossa",
        "Pubic arch",
      ],
      answer: "Anal triangle",
      explanation:
        "The anal triangle forms the posterior half of the perineum and contains the anal canal.",
    },
  ],

  head: [
    {
      text: "Which bone protects the brain?",
      options: ["Femur", "Humerus", "Skull", "Pelvis"],
      answer: "Skull",
      explanation:
        "The skull encases the brain, protecting it from impact and supporting sensory structures.",
    },
    {
      text: "Which joint allows movement of the lower jaw?",
      options: [
        "Temporomandibular joint",
        "Atlanto-occipital joint",
        "Zygomatic arch",
        "Cranial suture",
      ],
      answer: "Temporomandibular joint",
      explanation:
        "The temporomandibular joint connects the mandible to the temporal bone, allowing chewing and speaking.",
    },
    {
      text: "Which nerve provides motor control to the facial muscles?",
      options: [
        "Facial nerve (VII)",
        "Trigeminal nerve (V)",
        "Optic nerve (II)",
        "Vagus nerve (X)",
      ],
      answer: "Facial nerve (VII)",
      explanation:
        "The facial nerve controls muscles of facial expression and conveys taste from the anterior tongue.",
    },
    {
      text: "Which bones form the roof of the oral cavity?",
      options: [
        "Maxilla and palatine bones",
        "Mandible and zygomatic bones",
        "Frontal and temporal bones",
        "Ethmoid and sphenoid bones",
      ],
      answer: "Maxilla and palatine bones",
      explanation:
        "The hard palate consists of the palatine processes of the maxilla and the horizontal plates of the palatine bones.",
    },
  ],

  neck: [
    {
      text: "Which structure passes through the neck?",
      options: ["Spinal cord", "Femoral artery", "Pancreas", "Lungs"],
      answer: "Spinal cord",
      explanation:
        "The spinal cord travels through the cervical vertebral canal, connecting the brain to the body.",
    },
    {
      text: "Which gland lies anterior to the trachea in the neck?",
      options: [
        "Thyroid gland",
        "Parotid gland",
        "Pineal gland",
        "Adrenal gland",
      ],
      answer: "Thyroid gland",
      explanation:
        "The thyroid gland sits just below the larynx and produces hormones regulating metabolism.",
    },
    {
      text: "Which muscle divides the neck into anterior and posterior triangles?",
      options: ["Sternocleidomastoid", "Trapezius", "Scalenes", "Platysma"],
      answer: "Sternocleidomastoid",
      explanation:
        "The sternocleidomastoid runs from the sternum and clavicle to the mastoid process, dividing the neck regions.",
    },
    {
      text: "Which arteries supply the head and neck with oxygenated blood?",
      options: [
        "Carotid arteries",
        "Radial arteries",
        "Femoral arteries",
        "Subclavian veins",
      ],
      answer: "Carotid arteries",
      explanation:
        "The common carotid arteries branch into internal and external carotids, supplying the brain and face.",
    },
  ],

  upperlimb: [
    {
      text: "Which bone is in the upper limb?",
      options: ["Femur", "Humerus", "Tibia", "Fibula"],
      answer: "Humerus",
      explanation:
        "The humerus forms the upper arm, articulating with the scapula at the shoulder and ulna at the elbow.",
    },
    {
      text: "Which joint connects the upper limb to the trunk?",
      options: [
        "Shoulder joint",
        "Elbow joint",
        "Wrist joint",
        "Sternoclavicular joint",
      ],
      answer: "Shoulder joint",
      explanation:
        "The shoulder (glenohumeral) joint connects the humerus to the scapula, allowing wide arm movement.",
    },
    {
      text: "Which artery supplies the arm with blood?",
      options: [
        "Brachial artery",
        "Femoral artery",
        "Carotid artery",
        "Radial artery",
      ],
      answer: "Brachial artery",
      explanation:
        "The brachial artery is the main blood supply of the arm, continuing from the axillary artery.",
    },
    {
      text: "Which nerve controls most of the hand muscles?",
      options: [
        "Ulnar nerve",
        "Sciatic nerve",
        "Median nerve",
        "Axillary nerve",
      ],
      answer: "Ulnar nerve",
      explanation:
        "The ulnar nerve supplies the intrinsic muscles of the hand responsible for fine motor control.",
    },
  ],

  lowerlimb: [
    {
      text: "Which muscle is primarily used for walking?",
      options: ["Biceps brachii", "Quadriceps femoris", "Deltoid", "Trapezius"],
      answer: "Quadriceps femoris",
      explanation:
        "The quadriceps femoris extends the knee, essential for standing and walking.",
    },
    {
      text: "Which artery supplies the lower limb?",
      options: [
        "Femoral artery",
        "Brachial artery",
        "Radial artery",
        "Carotid artery",
      ],
      answer: "Femoral artery",
      explanation:
        "The femoral artery continues from the external iliac artery to supply oxygenated blood to the leg.",
    },
    {
      text: "Which nerve is the largest in the body?",
      options: [
        "Sciatic nerve",
        "Femoral nerve",
        "Obturator nerve",
        "Tibial nerve",
      ],
      answer: "Sciatic nerve",
      explanation:
        "The sciatic nerve originates from the sacral plexus and runs down the posterior thigh to the leg.",
    },
    {
      text: "Which bone forms the heel of the foot?",
      options: ["Calcaneus", "Talus", "Navicular", "Cuboid"],
      answer: "Calcaneus",
      explanation:
        "The calcaneus, or heel bone, is the largest tarsal bone and supports body weight during standing and walking.",
    },
  ],
};
