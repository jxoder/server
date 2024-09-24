# ComfyUI API

### REST API 목록

- GET /embeddings
  - 확인 필요.
- GET /models/{folder}
  - 모델 리스트 조회
  - folder 는 models 경로 폴더
    - checkpoints
    - loras
- GET /view?filename={filename}&type={type}&subfolder={subfolder}&t={ts}
  - type 은 output, temp (더 있을 수도)
  - filename 은 comfy 에서 제공하는 파일이름
- GET /system_stats
  - comfy 시스템 정보 조회
- GET /prompt
  - 현재 남은 task + 진행중인 task
- GET /object_info
  - node 들의 정보. 나중에 매핑하거나, validate 용도로 쓸 수 있을듯
- GET /object_info/{node_class}
  - 단일 node 정보 조회
- GET /history
  - 완료된 task history
- GET /history/{queue}
  - 완료된 단일 task history
  - task 가 완료되어야 history 로 조회 가능함.
- GET /queue
  - 진행중인 task 와 pending 상태 task 조회
- POST /prompt
  - workflow 전송하는 api
- POST /queue
  - 뭔지 모르겠음.
- POST /interrupt
  - 현재 진행중인 task 중지.
- POST /free
  - body 에 { "free_memory": true } 로 넣으면 vram 비울 수 있음.
  - { "unload_model": true } 는 잘 모르겠음.
- POST /history
  - body: { "clear": true } 는 모든 히스토리 삭제
  - body: { "delete": ["promptId"]} 는 특정 히스토리만 삭제

### WS

ws://192.168.0.3:8188/ws?clientId={clientId} 로 connect

type 별 response

- status
  - 상태
  - { "type": "status", data: { "status": { "exec_info": { "queue_remaining": 0 }}}}
- execution_start
  - task 시작
  - { "type": "execution_start", "data": { "prompt_id": "id", "timestamp": date }}
- executing
  - node 시작
  - node 가 null 인 경우가 있는데 이때 따로 오류는 안주고 해당 상태일 때 workflow 오류 인듯.
  - { "type": "executing", "data": {"node": "1", "display_node": "1", "prompt_id": "id" }}
- execution_error
  - 오류
  - {"type": "execution_error", "data": {"prompt_id": "39461444-e332-44c7-aa1b-8273e9f378d8", "node_id": "4", "node_type": "CheckpointLoaderSimple", "executed": [], "exception_message": "ERROR: Could not detect model type of: /home/desk/comfyui/models/checkpoints/SDXL/Neon_lines_SDXL_v1_0.safetensors", "exception_type": "RuntimeError", "traceback": [""]
- progress
  - { "type": "progress", "data": { "value": 1, "max": 30, "prompt_id": "id", "node": "10" }}
- binary
  - binary 로 전송됨. 아마 이미지 인듯?
- executed
  - progress 다음?.
  - {"type": "executed", "data": { "node": "1", "output": { "images": [{ "filename": "name", "subfolder": "subfolder", "type": "temp" }] }}}
- execution_success
  - task 완료
    - { "type": "execution_success", "data": {"prompt_id": "", "timestamp": date }}
  -
