/* instrumentation.ts */
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Resource, resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// Configuración del Exportador
const traceExporter = new OTLPTraceExporter({
  url:
    (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318") +
    "/v1/traces",
});

const resource: Resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "hello-otel",
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-net": { enabled: false },
      "@opentelemetry/instrumentation-pino": { enabled: false },
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});

sdk.start();

// Graceful shutdown
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
