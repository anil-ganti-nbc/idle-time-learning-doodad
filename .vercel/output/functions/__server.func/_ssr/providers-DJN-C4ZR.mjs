//#region node_modules/.nitro/vite/services/ssr/assets/providers-DJN-C4ZR.js
var PROVIDER_META = {
	xai: {
		label: "xAI / Grok",
		defaultModel: "grok-4.5",
		models: ["grok-4.5", "grok-4-fast"],
		wired: true
	},
	openai: {
		label: "OpenAI",
		defaultModel: "gpt-4o",
		models: ["gpt-4o", "gpt-4o-mini"],
		wired: false
	},
	anthropic: {
		label: "Anthropic",
		defaultModel: "claude-sonnet-4-20250514",
		models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-latest"],
		wired: false
	},
	gemini: {
		label: "Gemini",
		defaultModel: "gemini-2.0-flash",
		models: ["gemini-2.0-flash", "gemini-2.0-flash-lite"],
		wired: false
	},
	local: {
		label: "Local (OpenAI-compatible)",
		defaultModel: "local-model",
		models: ["local-model"],
		wired: false
	}
};
async function complete(req) {
	try {
		switch (req.provider) {
			case "xai": return openaiCompat({
				url: "https://api.x.ai/v1/chat/completions",
				apiKey: req.apiKey,
				model: req.model,
				system: req.system,
				user: req.user,
				maxTokens: req.maxTokens,
				provider: "xai"
			});
			case "openai": return openaiCompat({
				url: "https://api.openai.com/v1/chat/completions",
				apiKey: req.apiKey,
				model: req.model,
				system: req.system,
				user: req.user,
				maxTokens: req.maxTokens,
				provider: "openai"
			});
			case "local":
				if (!req.baseUrl) return {
					ok: false,
					error: "Local provider needs a base URL."
				};
				return openaiCompat({
					url: `${req.baseUrl.replace(/\/$/, "")}/chat/completions`,
					apiKey: req.apiKey ?? "local",
					model: req.model,
					system: req.system,
					user: req.user,
					maxTokens: req.maxTokens,
					provider: "local"
				});
			case "anthropic": return anthropic(req);
			case "gemini": return gemini(req);
		}
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Provider request failed."
		};
	}
}
async function openaiCompat(opts) {
	if (!opts.apiKey) return {
		ok: false,
		error: `No API key for ${opts.provider}.`
	};
	const res = await fetch(opts.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${opts.apiKey}`
		},
		body: JSON.stringify({
			model: opts.model,
			temperature: .4,
			max_tokens: opts.maxTokens ?? 1800,
			messages: [{
				role: "system",
				content: opts.system
			}, {
				role: "user",
				content: opts.user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `${opts.provider} error ${res.status}`,
		status: res.status
	};
	const body = await res.json();
	const text = body.choices?.[0]?.message?.content ?? "";
	if (!text) return {
		ok: false,
		error: "Provider returned an empty response."
	};
	return {
		ok: true,
		text,
		model: body.model ?? opts.model,
		provider: opts.provider,
		inputTokens: body.usage?.prompt_tokens,
		outputTokens: body.usage?.completion_tokens
	};
}
async function anthropic(req) {
	if (!req.apiKey) return {
		ok: false,
		error: "No API key for Anthropic."
	};
	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": req.apiKey,
			"anthropic-version": "2023-06-01"
		},
		body: JSON.stringify({
			model: req.model,
			max_tokens: req.maxTokens ?? 1800,
			system: req.system,
			messages: [{
				role: "user",
				content: req.user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Anthropic error ${res.status}`,
		status: res.status
	};
	const body = await res.json();
	const text = body.content?.find((c) => c.type === "text")?.text ?? "";
	if (!text) return {
		ok: false,
		error: "Anthropic returned an empty response."
	};
	return {
		ok: true,
		text,
		model: req.model,
		provider: "anthropic",
		inputTokens: body.usage?.input_tokens,
		outputTokens: body.usage?.output_tokens
	};
}
async function gemini(req) {
	if (!req.apiKey) return {
		ok: false,
		error: "No API key for Gemini."
	};
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(req.model)}:generateContent?key=${encodeURIComponent(req.apiKey)}`;
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			systemInstruction: { parts: [{ text: req.system }] },
			contents: [{
				role: "user",
				parts: [{ text: req.user }]
			}],
			generationConfig: {
				maxOutputTokens: req.maxTokens ?? 1800,
				temperature: .4
			}
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Gemini error ${res.status}`,
		status: res.status
	};
	const body = await res.json();
	const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
	if (!text) return {
		ok: false,
		error: "Gemini returned an empty response."
	};
	return {
		ok: true,
		text,
		model: req.model,
		provider: "gemini",
		inputTokens: body.usageMetadata?.promptTokenCount,
		outputTokens: body.usageMetadata?.candidatesTokenCount
	};
}
function estimateTokens(text) {
	return Math.max(1, Math.round(text.length / 4));
}
//#endregion
export { complete as n, estimateTokens as r, PROVIDER_META as t };
