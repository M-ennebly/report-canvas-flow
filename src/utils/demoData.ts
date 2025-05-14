import { Task } from "@/types";

// Better image URLs for figures based on engineering/industrial themes
const figureImages = {
  refrigeration: [
    "https://source.unsplash.com/random/800x600/?refrigeration",
    "https://source.unsplash.com/random/800x600/?cold+storage",
    "https://source.unsplash.com/random/800x600/?industrial+cooling"
  ],
  conveyor: [
    "https://source.unsplash.com/random/800x600/?conveyor+belt",
    "https://source.unsplash.com/random/800x600/?factory+automation",
    "https://source.unsplash.com/random/800x600/?industrial+machinery"
  ],
  filter: [
    "https://source.unsplash.com/random/800x600/?industrial+filter",
    "https://source.unsplash.com/random/800x600/?sorting+machine",
    "https://source.unsplash.com/random/800x600/?filtration+system" 
  ],
  optical: [
    "https://source.unsplash.com/random/800x600/?optical+scanner",
    "https://source.unsplash.com/random/800x600/?quality+inspection",
    "https://source.unsplash.com/random/800x600/?vision+system"
  ],
  analysis: [
    "https://source.unsplash.com/random/800x600/?data+analysis",
    "https://source.unsplash.com/random/800x600/?chart+graph",
    "https://source.unsplash.com/random/800x600/?data+visualization" 
  ],
  energy: [
    "https://source.unsplash.com/random/800x600/?energy+efficiency",
    "https://source.unsplash.com/random/800x600/?renewable+energy",
    "https://source.unsplash.com/random/800x600/?power+consumption" 
  ],
  cost: [
    "https://source.unsplash.com/random/800x600/?cost+analysis",
    "https://source.unsplash.com/random/800x600/?business+chart",
    "https://source.unsplash.com/random/800x600/?financial+graph" 
  ],
  shelling: [
    "https://source.unsplash.com/random/800x600/?food+processing",
    "https://source.unsplash.com/random/800x600/?industrial+blades",
    "https://source.unsplash.com/random/800x600/?nut+processing" 
  ],
  sensors: [
    "https://source.unsplash.com/random/800x600/?sensor+network",
    "https://source.unsplash.com/random/800x600/?iot+devices",
    "https://source.unsplash.com/random/800x600/?monitoring+system" 
  ],
  testing: [
    "https://source.unsplash.com/random/800x600/?quality+testing",
    "https://source.unsplash.com/random/800x600/?lab+testing",
    "https://source.unsplash.com/random/800x600/?product+inspection" 
  ],
  mechanical: [
    "https://source.unsplash.com/random/800x600/?mechanical+engineering",
    "https://source.unsplash.com/random/800x600/?stress+testing",
    "https://source.unsplash.com/random/800x600/?mechanical+analysis" 
  ],
  quality: [
    "https://source.unsplash.com/random/800x600/?quality+control",
    "https://source.unsplash.com/random/800x600/?product+quality",
    "https://source.unsplash.com/random/800x600/?quality+check" 
  ],
  // Fallback images
  fallback: [
    "https://source.unsplash.com/random/800x600/?engineering",
    "https://source.unsplash.com/random/800x600/?machine",
    "https://source.unsplash.com/random/800x600/?agriculture",
    "https://source.unsplash.com/random/800x600/?processing"
  ]
};

// Predefined tasks and figures for the almond processing project
const almondTasksData = {
  design: [
    {
      title: "Redesign of the Refrigerated Almond Storage Chamber",
      category: "refrigeration",
      figures: [
        {
          title: "Storage Chamber Expansion Blueprint",
          description: "Technical drawing that enables increased refrigeration volume, optimizing airflow and operational efficiency."
        },
        {
          title: "Side View of Internal Supports",
          description: "Modular structure designed to enhance workflow and almond preservation."
        }
      ]
    },
    {
      title: "Design of the Enhanced Drying Conveyor System",
      category: "conveyor",
      figures: [
        {
          title: "Drying Conveyor Side View",
          description: "Layout showing modular belt design for even heat distribution."
        },
        {
          title: "Motor Assembly Diagram",
          description: "Shows positioning of rotary motor for improved airflow dynamics."
        }
      ]
    },
    {
      title: "Filter System Customization for Almond Sizing",
      category: "filter",
      figures: [
        {
          title: "Modular Filter Components (Top View)",
          description: "Blueprint of interchangeable filter elements for size-based separation."
        },
        {
          title: "Outlet Calibration Schematic",
          description: "Shows filter gate positions for controlled almond flow by caliber."
        }
      ]
    },
    {
      title: "Blueprint of the New Optical Selection Line",
      category: "optical",
      figures: [
        {
          title: "Full Line Layout",
          description: "Top-down diagram of the optical sorter integrated into the shelling process."
        },
        {
          title: "Sensor Zones Map",
          description: "Breakdown of sensor positioning and classification checkpoints."
        }
      ]
    }
  ],
  analyse: [
    {
      title: "Efficiency Analysis of the Almond Drying System",
      category: "analysis",
      figures: [
        {
          title: "Drying Process Flow Diagram",
          description: "Visual breakdown of drying stages, identifying key risk points."
        },
        {
          title: "Temperature vs Humidity Simulation",
          description: "Graphical data validating optimal drying conditions."
        }
      ]
    },
    {
      title: "Environmental Impact Study of Storage Expansion",
      category: "energy",
      figures: [
        {
          title: "Refrigeration Energy Use Chart",
          description: "Comparison of energy use before and after redesign."
        },
        {
          title: "Emission Projection Model",
          description: "Predictive analysis of CO2 output reduction."
        }
      ]
    },
    {
      title: "Cost-Benefit Study of Automated Sorting",
      category: "cost",
      figures: [
        {
          title: "Labor Cost Comparison Table",
          description: "Manual vs automated labor cost per 100kg of almonds."
        },
        {
          title: "Efficiency ROI Curve",
          description: "Expected return on sorter investment over 12 months."
        }
      ]
    }
  ],
  dev: [
    {
      title: "Assembly of High-Speed Shelling Unit",
      category: "shelling",
      figures: [
        {
          title: "Shelling Blades Installation Diagram",
          description: "Shows precise blade positioning for minimal kernel damage."
        },
        {
          title: "Output Rate Table",
          description: "Data for throughput at different shell sizes."
        }
      ]
    },
    {
      title: "Calibration of Optical Sorting Algorithms",
      category: "optical",
      figures: [
        {
          title: "Image Recognition Heatmap",
          description: "AI model performance in defect detection across test batches."
        },
        {
          title: "Defect Classification Accuracy Graph",
          description: "Results for identifying chipped, shriveled, or discolored almonds."
        }
      ]
    },
    {
      title: "Integration of Smart Sensors into Cold Storage",
      category: "sensors",
      figures: [
        {
          title: "Sensor Grid Layout",
          description: "Floor-level schematic of distributed temperature and humidity sensors."
        },
        {
          title: "Data Dashboard Mockup",
          description: "UI sketch for real-time environment monitoring."
        }
      ]
    }
  ],
  testing: [
    {
      title: "Validation of Filter-Based Size Classification",
      category: "testing",
      figures: [
        {
          title: "Before/After Sorting Comparison",
          description: "Visual proof of sizing improvement with new filter set."
        },
        {
          title: "Calibration Metrics Table",
          description: "Data confirming uniformity tolerance."
        }
      ]
    },
    {
      title: "Mechanical Stress Testing of the Conveyor System",
      category: "mechanical",
      figures: [
        {
          title: "Load Tolerance Curve",
          description: "Graph of max belt load vs deformation."
        },
        {
          title: "Vibration Analysis Results",
          description: "Mechanical stability across 3 RPM settings."
        }
      ]
    },
    {
      title: "Quality Control Test of Final Almond Output",
      category: "quality",
      figures: [
        {
          title: "Quality Grade Distribution Chart",
          description: "Percent of almonds classified by quality after processing."
        },
        {
          title: "Consumer Pack Inspection Sheet",
          description: "Visual packaging results showing defect-free almond batches."
        }
      ]
    }
  ]
};

// Task titles by category (keeping the old ones as fallback)
const taskTitles = {
  design: [
    "Design the user flow for mobile app",
    "Create wireframes for dashboard",
    "Visual design for landing page",
    "UI component system design"
  ],
  analyse: [
    "Market growth analysis",
    "Customer segmentation report",
    "Competitive landscape review",
    "ROI analysis for product features"
  ],
  dev: [
    "Implement authentication system",
    "Build analytics dashboard",
    "Create API integration layer",
    "Develop mobile notification service"
  ],
  testing: [
    "User acceptance test plan",
    "Performance benchmarking",
    "Security vulnerability assessment",
    "Cross-platform compatibility testing"
  ]
};

// Figure titles by category (keeping the old ones as fallback)
const figureTitles = {
  design: [
    "User Flow Diagram", 
    "Wireframe Layout", 
    "Color Scheme Palette", 
    "Component Library"
  ],
  analyse: [
    "Market Share Graph", 
    "Customer Demographics", 
    "Competitor Comparison", 
    "Trend Analysis Chart"
  ],
  dev: [
    "System Architecture", 
    "Database Schema", 
    "API Endpoints", 
    "Service Integration Map"
  ],
  testing: [
    "Test Coverage Report", 
    "Performance Metrics", 
    "Error Rate Analysis", 
    "User Feedback Summary"
  ]
};

// Generate demo tasks based on the selected labels
export const generateDemoTasks = (
  labelId?: string, 
  selectedLabels: string[] = []
): Task[] => {
  const tasks: Task[] = [];
  const columns = labelId 
    ? [labelId] 
    : selectedLabels.length > 0 
      ? selectedLabels 
      : ["design", "analyse", "dev", "testing"];

  columns.forEach(column => {
    // Use predefined almond processing data
    const columnData = almondTasksData[column as keyof typeof almondTasksData];
    
    if (columnData) {
      columnData.forEach((taskData, taskIndex) => {
        const taskId = `task-${column}-${taskIndex}`;
        const category = taskData.category || "fallback";
        const categoryImages = figureImages[category as keyof typeof figureImages] || figureImages.fallback;
        
        const figures = taskData.figures.map((figureData, figureIndex) => ({
          id: `figure-${column}-${taskIndex}-${figureIndex}`,
          title: figureData.title,
          description: figureData.description,
          imageUrl: categoryImages[figureIndex % categoryImages.length],
          pageNumber: Math.floor(Math.random() * 20) + 1,
        }));
        
        tasks.push({
          id: taskId,
          title: taskData.title,
          figures: figures,
          column: column as "design" | "analyse" | "dev" | "testing",
        });
      });
    } else {
      // Fallback to the old random generation logic
      const taskCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < taskCount; i++) {
        const titles = taskTitles[column as keyof typeof taskTitles];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        const figureCount = Math.floor(Math.random() * 4) + 1;
        const figures = [];
        
        for (let j = 0; j < figureCount; j++) {
          const figureTitle = figureTitles[column as keyof typeof figureTitles][j % 4];
          
          figures.push({
            id: `figure-${column}-${i}-${j}`,
            title: figureTitle,
            description: `Description for ${figureTitle}`,
            imageUrl: figureImages.fallback[Math.floor(Math.random() * figureImages.fallback.length)],
            pageNumber: Math.floor(Math.random() * 20) + 1,
          });
        }
        
        const taskId = `task-${column}-${i}`;
        tasks.push({
          id: taskId,
          title: title,
          figures: figures,
          column: column as "design" | "analyse" | "dev" | "testing",
        });
      }
    }
  });

  return tasks;
};
