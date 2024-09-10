import psutil
try:
    import pynvml
    pynvml.nvmlInit()
    GPU_AVAILABLE = True
except:
    GPU_AVAILABLE = False

def get_cpu_info():
    cpu_percent = psutil.cpu_percent(interval=1, percpu=True)
    cpu_freq = psutil.cpu_freq(percpu=True)
    return {
        'percent': cpu_percent,
        'freq': [{'current': f.current, 'min': f.min, 'max': f.max} for f in cpu_freq]
    }

def get_ram_info():
    ram = psutil.virtual_memory()
    return {
        'total': ram.total,
        'available': ram.available,
        'percent': ram.percent,
        'used': ram.used,
        'free': ram.free
    }

def get_gpu_info():
    if not GPU_AVAILABLE:
        return None

    gpu_info = []
    device_count = pynvml.nvmlDeviceGetCount()
    for i in range(device_count):
        handle = pynvml.nvmlDeviceGetHandleByIndex(i)
        util = pynvml.nvmlDeviceGetUtilizationRates(handle)
        mem_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        gpu_info.append({
            'index': i,
            'name': pynvml.nvmlDeviceGetName(handle) if isinstance(pynvml.nvmlDeviceGetName(handle), str) else pynvml.nvmlDeviceGetName(handle).decode('utf-8'),
            'utilization': util.gpu,
            'memory': {
                'total': mem_info.total,
                'used': mem_info.used,
                'free': mem_info.free
            }
        })
    return gpu_info

def get_system_metrics():
    return {
        'cpu': get_cpu_info(),
        'ram': get_ram_info(),
        'gpu': get_gpu_info()
    }
