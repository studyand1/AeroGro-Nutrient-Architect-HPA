# AeroGro Nutrient Architect

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/studyand1/AeroGro-Nutrient-Architect-HPA)

A minimalist, client-side tool to configure, calculate, and manage nutrient solutions for HPA aeroponic leafy greens.

## About The Project

AeroGro Nutrient Architect is a sophisticated, minimalist web application designed to provide precision nutrient solution configuration for High-Pressure Aeroponics (HPA) systems, specifically for leafy greens. The tool empowers growers by simplifying complex calculations for fertilizer dosing and pH management. It features a dual-mode dosing calculator: a rapid, EC-based empirical method for quick adjustments, and an element-precise method for meticulous recipe formulation. The application includes a dedicated module for safe handling and dilution of phosphoric acid for pH control, complete with integrated safety warnings. A smart decision-logic engine guides users on when and how to top up their nutrient solution based on real-time EC and pH sensor data. All user configurations are saved locally for convenience, creating a seamless and efficient workflow.

### Key Features

*   **Dual Dosing Calculators**: Switch between a quick EC-based empirical calculator and a highly accurate element-precise calculator.
*   **Advanced pH Management**: Safely calculate dilutions for concentrated phosphoric acid with prominent safety warnings and dosing estimates.
*   **Smart Decision Helper**: Get clear, actionable advice on nutrient and pH adjustments based on your current sensor readings.
*   **Growth Stage Configuration**: Define and save custom EC and pH targets for different growth stages (e.g., seedling, vegetative, mature).
*   **Fertilizer Profile Management**: Input and save the composition of your A/B fertilizer stocks for accurate calculations.
*   **Client-Side Persistence**: All your configurations are automatically saved in your browser's local storage, no account needed.
*   **Responsive Design**: A clean, mobile-first interface that works beautifully on any device.

## Technology Stack

This project is built with a modern, high-performance tech stack:

*   **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
*   **Forms**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/), [Hono](https://hono.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/aerogro-nutrient-architect.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd aerogro-nutrient-architect
    ```
3.  Install dependencies:
    ```sh
    bun install
    ```

### Running the Development Server

To start the local development server, run the following command:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view the application in your browser.

## Usage

The application is designed to be intuitive and follows a logical workflow:

1.  **Recipe Configuration**: Start by entering the chemical composition of your 'A' and 'B' fertilizer stocks. Then, define the target EC and pH levels for each growth stage of your plants.
2.  **Dosing Calculation**: Navigate to the Dosing Calculator.
    *   Use the **Empirical** tab for quick calculations based on your target EC.
    *   Use the **Precise** tab for detailed, element-based calculations for maximum accuracy.
3.  **pH Control**: If your pH is high, use the pH Control panel to calculate the correct dilution for your phosphoric acid and get dosing recommendations. Always follow the safety warnings.
4.  **Decision Helper**: Enter your current EC and pH readings from your sensors. The tool will provide clear instructions, such as "Add 5.2g of Stock A and 5.2g of Stock B" or "Add 3mL of diluted acid."

## Deployment

This application is designed for easy deployment to the Cloudflare global network.

1.  Build the application for production:
    ```sh
    bun run build
    ```
2.  Deploy using the Wrangler CLI:
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/studyand1/AeroGro-Nutrient-Architect-HPA-)

## License

Distributed under the MIT License. See `LICENSE` for more information.